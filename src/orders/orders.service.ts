import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { OrdersProductsEntity } from 'src/orders/entities/orders-products.entity';
import { ShippingEntity } from 'src/orders/entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from 'src/orders/dto/update-order-status.dto';
import { OrderStatus } from 'src/orders/enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrdersProductsEntity)
    private readonly opRepository: Repository<OrdersProductsEntity>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,
  ) {}
  async create(
    createOrderDto: CreateOrderDto,
    currentUser: UserEntity,
  ): Promise<OrderEntity> {
    const orderEntity = await this.orderRepository.save({
      shippingAddress: createOrderDto.shippingAddress,
      user: currentUser,
    });

    const productIds = createOrderDto.orderedProducts.map((op) => op.id);
    const products = await this.productService.findMany(productIds);

    const opEntities = createOrderDto.orderedProducts.map((op) => ({
      order: orderEntity,
      product: products.find((p) => p.id === op.id),
      product_quantity: op.product_quantity,
      purchased: true,
    }));

    await this.opRepository
      .createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(opEntities)
      .execute();

    return this.findOne(orderEntity.id);
  }

  async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
  }

  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return {
      ...order,
      products: order.products.map((op) => ({
        id: op.id,
        order: op.order,
        product_quantity: op.product_quantity,
        product: op.product,
        purchased: op.purchased,
      })),
    };
  }

  async findOneByProductId(id: number) {
    return await this.opRepository.findOne({
      relations: { product: true },
      where: { product: { id: id } },
    });
  }

  async update(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: UserEntity,
  ) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');

    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CENCELLED
    ) {
      throw new BadRequestException(`Order already ${order.status}`);
    }
    if (
      order.status === OrderStatus.PROCESSING &&
      updateOrderStatusDto.status != OrderStatus.SHIPPED
    ) {
      throw new BadRequestException(`Delivery before shipped !!!`);
    }
    if (
      updateOrderStatusDto.status === OrderStatus.SHIPPED &&
      order.status === OrderStatus.SHIPPED
    ) {
      return order;
    }
    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }
    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, OrderStatus.DELIVERED);
    }
    return order;
  }

  async cancelled(id: number, currentUser: UserEntity) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order Not Found.');

    if (order.status === OrderStatus.CENCELLED) return order;

    order.status = OrderStatus.CENCELLED;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);
    await this.stockUpdate(order, OrderStatus.CENCELLED);
    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order: OrderEntity, status: string) {
    for (const op of order.products) {
      await this.productService.updateStock(
        op.product.id,
        op.product_quantity,
        status,
      );
    }
  }
}
