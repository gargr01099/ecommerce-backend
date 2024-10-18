import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Product should not be empty.' })
  @IsNumber({}, { message: 'Product Id should be number' })
  productId: number;

  @IsNotEmpty({ message: 'Ratings could not be empty.' })
  @IsNumber({}, { message: 'Ratings must be a number.' })
  @Min(1, { message: 'Ratings must be at least 1.' })
  @Max(5, { message: 'Ratings must be at most 5.' })
  ratings: number;
  @IsNotEmpty({ message: 'comment should not be empty' })
  @IsString()
  comment: string;
}
