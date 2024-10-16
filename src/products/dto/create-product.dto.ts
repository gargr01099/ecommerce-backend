import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'title can not be blank.' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'description can not be empty.' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'price should not be empty' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price should be number & max decimal precission 2' },
  )
  @IsPositive({ message: 'price should be positive number' })
  price: number;

  @IsNotEmpty({ message: 'stock should not be empty.' })
  @IsNumber({}, { message: 'stock should be number' })
  @Min(0, { message: 'stock can not be negative.' })
  stock: number;
}
