import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from 'src/reviews/reviews.service';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { UpdateReviewDto } from 'src/reviews/dto/update-review.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { Roles } from 'src/utility/common/user-roles.enum';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ReviewEntity> {
    return await this.reviewsService.create(createReviewDto, currentUser);
  }

  @Get('/all')
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get()
  async findAllByProduct(@Body('productId') productId: number) {
    return await this.reviewsService.findAllByProduct(+productId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReviewEntity> {
    return await this.reviewsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
