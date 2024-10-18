import { Injectable, NotFoundException } from '@nestjs/common';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  async addToCart(
    user: UserEntity,
    product: ProductEntity,
    quantity: number,
  ): Promise<CartEntity> {
    const existingCartItem = await this.cartRepository.findOne({
      where: { user: { id: user.id }, product: { id: product.id } },
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      return await this.cartRepository.save(existingCartItem);
    } else {
      const cartItem = this.cartRepository.create({ user, product, quantity });
      return await this.cartRepository.save(cartItem);
    }
  }
  async getCartItems(user: UserEntity): Promise<CartEntity[]> {
    return await this.cartRepository.find({
      where: { user: { id: user.id } },
      relations: ['product'],
    });
  }

  async updateCartItemQuantity(
    cartItemId: number,
    quantity: number,
  ): Promise<CartEntity> {
    const cartItem = await this.cartRepository.findOne({
      where: { id: cartItemId },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    cartItem.quantity = quantity;
    return await this.cartRepository.save(cartItem);
  }

  async removeFromCart(cartItemId: number): Promise<void> {
    const cartItem = await this.cartRepository.findOne({
      where: { id: cartItemId },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.cartRepository.remove(cartItem);
  }

  async clearCart(user: UserEntity): Promise<void> {
    await this.cartRepository.delete({ user: { id: user.id } });
  }
}
