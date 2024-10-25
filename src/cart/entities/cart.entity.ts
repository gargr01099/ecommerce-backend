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

  //user can have multiple carts...
  @ManyToOne(() => UserEntity, (user) => user.carts)
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.carts)
  product: ProductEntity;

  @Column()
  quantity: number;
}

//You can omit @JoinColumn in a @ManyToOne / @OneToMany relation.
//@OneToMany cannot exist without @ManyToOne
//If you want to use @OneToMany, @ManyToOne is required. However, the inverse is not required: If you only care about the @ManyToOne relationship, you can define it without having @OneToMany on the related entity. Where you set @ManyToOne - its related entity will have "relation id" and foreign key.
//With cascades enabled you can save this relation with only one save call.

