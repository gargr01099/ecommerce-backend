import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: CartEntity; // Many items belong to one cart

  @ManyToOne(() => ProductEntity)
  product: ProductEntity; // Each item is associated with one product

  @Column()
  quantity: number;
}
