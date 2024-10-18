import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersController } from 'src/orders/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { OrdersProductsEntity } from 'src/orders/entities/orders-products.entity';
import { ShippingEntity } from 'src/orders/entities/shipping.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrdersProductsEntity,
      ShippingEntity,
    ]),
    forwardRef(() => ProductsModule), //to avoid circular dependency
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
