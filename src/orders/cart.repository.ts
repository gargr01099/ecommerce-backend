import { Injectable, NotFoundException } from '@nestjs/common';
import { CartEntity } from './cart.entity';
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

  // Add a product to the cart
  async addToCart(user: UserEntity, product: ProductEntity, quantity: number): Promise<CartEntity> {
    // Check if the product is already in the cart
    const existingCartItem = await this.cartRepository.findOne({
      where: { user: { id: user.id }, product: { id: product.id } },
    });

    if (existingCartItem) {
      // Update the quantity if the product is already in the cart
      existingCartItem.quantity += quantity;
      return await this.cartRepository.save(existingCartItem);
    } else {
      // Create a new cart item if it doesn't exist
      const cartItem = this.cartRepository.create({ user, product, quantity });
      return await this.cartRepository.save(cartItem);
    }
  }

  // Get all cart items for a user
  async getCartItems(user: UserEntity): Promise<CartEntity[]> {
    return await this.cartRepository.find({
      where: { user: { id: user.id } },
      relations: ['product'], // Include product details in the result
    });
  }

  // Update quantity of a cart item
  async updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartEntity> {
    const cartItem = await this.cartRepository.findOne({ where: { id: cartItemId } });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    cartItem.quantity = quantity;
    return await this.cartRepository.save(cartItem);
  }

  // Remove a product from the cart
  async removeFromCart(cartItemId: number): Promise<void> {
    const cartItem = await this.cartRepository.findOne({ where: { id: cartItemId } });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.cartRepository.remove(cartItem);
  }

  // Clear the cart for a user
  async clearCart(user: UserEntity): Promise<void> {
    await this.cartRepository.delete({ user: { id: user.id } });
  }
}
