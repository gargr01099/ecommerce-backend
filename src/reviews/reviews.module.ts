import { Module } from '@nestjs/common';
import { ReviewsService } from 'src/reviews/reviews.service';
import { ReviewsController } from 'src/reviews/reviews.controller';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity]), ProductsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
