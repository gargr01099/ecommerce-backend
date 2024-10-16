import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderedProductsDto {
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsPositive()
  product_quantity: number;
}
