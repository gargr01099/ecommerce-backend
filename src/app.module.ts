import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UsersModule } from 'src/users/users.module';
import { CurrentUserMiddleware } from 'src/utility/middlewares/current-user.middleware';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductsModule } from 'src/products/products.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { OrdersModule } from 'src/orders/orders.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    ReviewsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
