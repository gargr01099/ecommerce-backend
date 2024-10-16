import { Type } from 'class-transformer';
import { CreateShippingDto } from 'src/orders/dto/create-shipping.dto';
import { ValidateNested } from 'class-validator';
import { OrderedProductsDto } from 'src/orders/dto/ordered-products.dto';

export class CreateOrderDto {
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shippingAddress: CreateShippingDto;

  @Type(() => OrderedProductsDto)
  @ValidateNested()
  orderedProducts: OrderedProductsDto[];
}
