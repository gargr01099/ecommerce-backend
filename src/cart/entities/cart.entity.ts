import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { CartItemEntity } from 'src/cart/entities/cart.item.entity';
@Entity({ name: 'carts' })
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //cascade true means when we delete a cart, it will delete all the items in the cart
  //when we update a cart, any changes to its cart items will be reflected in the database

  @OneToMany(() => CartItemEntity, (item) => item.cart, { cascade: true })
  items: CartItemEntity[];

  @ManyToOne(() => UserEntity, (user) => user.carts)
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.carts)
  product: ProductEntity;

  @Column()
  quantity: number;
}
