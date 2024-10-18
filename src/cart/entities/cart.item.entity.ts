import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: CartEntity; 

  @ManyToOne(() => ProductEntity)
  product: ProductEntity; 

  @Column()
  quantity: number;
}
