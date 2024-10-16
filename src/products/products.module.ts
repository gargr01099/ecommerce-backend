import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { ProductsController } from 'src/products/products.controller';
import { ProductEntity } from 'src/products/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories/categories.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    CategoriesModule,
    forwardRef(() => OrdersModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
