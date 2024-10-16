import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartEntity } from './cart.entity';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from '../products/products.service'; // Import the ProductService
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CartItemEntity } from './cart.item.entity';    
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/user-roles.enum';

@Controller('cart')
@UseGuards(AuthenticationGuard)
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductsService, // Inject ProductService here
  ) {}

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  @Post()
  async addToCart(
    @CurrentUser() user: UserEntity,
    @Body() body: { productId: number; quantity: number },
  ): Promise<CartEntity> {
    const product = await this.productService.findOne(body.productId); // Use injected product service
    console.log(product);
    return await this.cartService.addProductToCart(user, product, body.quantity);
  }

  @Get()
  async getCartItems(@CurrentUser() user: UserEntity): Promise<CartItemEntity[]> {
    return await this.cartService.getCartItems(user);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  @Patch(':id')
  async updateCartItemQuantity(
    @Param('id') id: number,
    @Body() body: { quantity: number },
  ): Promise<CartItemEntity> {
    return await this.cartService.updateCartItemQuantity(id, body.quantity);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  @Delete(':id')
  async removeFromCart(@Param('id') id: number): Promise<void> {
    return await this.cartService.removeFromCart(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  @Delete('clear')
  async clearCart(@CurrentUser() user: UserEntity): Promise<void> {
    return await this.cartService.clearCart(user);
  }
}
