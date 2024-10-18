import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { CartItemEntity } from 'src/cart/entities/cart.item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
  ) {}

  async addProductToCart(
    user: UserEntity,
    product: ProductEntity,
    quantity: number,
  ): Promise<CartEntity> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
    }

    const existingItem = cart.items.find(
      (item) => item.product.id === product.id,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
      });

      cart.items.push(newItem);
      await this.cartItemRepository.save(newItem);
    }

    return await this.cartRepository.save(cart);
  }

  async getCartItems(user: UserEntity): Promise<CartItemEntity[]> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items', 'items.product'],
    });
    return cart ? cart.items : [];
  }

  async updateCartItemQuantity(
    cartItemId: number,
    quantity: number,
  ): Promise<CartItemEntity> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    cartItem.quantity = quantity;
    return await this.cartItemRepository.save(cartItem);
  }

  async removeFromCart(cartItemId: number): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.cartItemRepository.remove(cartItem);
  }

  async clearCart(user: UserEntity): Promise<void> {
    await this.cartRepository.delete({ user: { id: user.id } });
  }
}
