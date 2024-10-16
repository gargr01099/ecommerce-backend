import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './cart.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { CartItemEntity } from './cart.item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
  ) {}

  async addProductToCart(user: UserEntity, product: ProductEntity, quantity: number): Promise<CartEntity> {
    let cart = await this.cartRepository.findOne({ where: { user: { id: user.id } }, relations: ['items'] });

    if (!cart) {
      // Create a new cart if none exists for the user
      cart = this.cartRepository.create({ user });
      await this.cartRepository.save(cart); // First, save the empty cart
    }

    // Find if the product already exists in the cart
    const existingItem = cart.items.find(item => item.product.id === product.id);

    if (existingItem) {
      // Update quantity if product already in cart
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem); // Update the existing cart item
    } else {
      // Create a new CartItemEntity for the new product
      const newItem = this.cartItemRepository.create({
        cart, // Associate with the current cart
        product, // Associate the product
        quantity, // Set the quantity
      });

      cart.items.push(newItem); // Push the new item to the cart
      await this.cartItemRepository.save(newItem); // Save the new cart item
    }

    return await this.cartRepository.save(cart); // Save and return the updated cart
  }

  // Get all cart items for a user
  async getCartItems(user: UserEntity): Promise<CartItemEntity[]> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items', 'items.product'], // Load related product information
    });
    return cart ? cart.items : []; // Return items or an empty array if no cart found
  }

  // Update quantity of a cart item
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

  // Remove a product from the cart
  async removeFromCart(cartItemId: number): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.cartItemRepository.remove(cartItem);
  }

  // Clear the cart for a user
  async clearCart(user: UserEntity): Promise<void> {
    await this.cartRepository.delete({ user: { id: user.id } });
  }
}
