import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderedProductsDto {
  @IsNotEmpty()
  id: number;

  // @IsNumber({ allowNaN: false, allowInfinity: false })
  // @IsPositive({ message: 'Price cannot be negative.' })
  // @MaxDecimalPlaces(2, { message: 'Price should have a maximum of 2 decimal places.' })
  // product_unit_price: number;

  @IsNumber()
  @IsPositive()
  product_quantity: number;
}
