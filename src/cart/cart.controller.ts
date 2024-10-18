import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CartItemEntity } from 'src/cart/entities/cart.item.entity';    
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('cart')
@ApiTags('cart')  
@UseGuards(AuthenticationGuard)
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductsService, 
  ) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  async addToCart(
    @CurrentUser() user: UserEntity,
    @Body() body: { productId: number; quantity: number },
  ): Promise<CartEntity> {
    const product = await this.productService.findOne(body.productId); 
    console.log(product);
    return await this.cartService.addProductToCart(user, product, body.quantity);
  }

  @Get()
  async getCartItems(@CurrentUser() user: UserEntity): Promise<CartItemEntity[]> {
    return await this.cartService.getCartItems(user);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  async updateCartItemQuantity(
    @Param('id') id: number,

    @Body() body: { quantity: number },
  ): Promise<CartItemEntity> {
    return await this.cartService.updateCartItemQuantity(id, body.quantity);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  async removeFromCart(@Param('id') id: number): Promise<void> {
    return await this.cartService.removeFromCart(id);
  }

  @Delete('clear')
  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  async clearCart(@CurrentUser() user: UserEntity): Promise<void> {
    return await this.cartService.clearCart(user);
  }
}
