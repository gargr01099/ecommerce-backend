import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Entity({ name: 'orders_products' })
export class OrdersProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.products)
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (prod) => prod.products, { cascade: true })
  product: ProductEntity;
  @Column({ default: false }) 
  purchased: boolean;
}
