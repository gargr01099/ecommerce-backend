// src/orders/dto/cart.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CartDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number; // The quantity of the product to add to the cart
}
