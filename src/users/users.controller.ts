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
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserSignUpDto } from 'src/users/dto/user-signup.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserSignInDto } from 'src/users/dto/user-signin.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({ type: UserSignUpDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async signup(
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<{ user: UserEntity }> {
    console.log(userSignUpDto);
    return { user: await this.usersService.signup(userSignUpDto) };
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: UserSignInDto })
  @ApiResponse({
    status: 200,
    description: 'User signed in successfully',
    type: UserEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async signin(@Body() userSignInDto: UserSignInDto): Promise<{
    accessToken: string;
    user: UserEntity;
  }> {
    const user = await this.usersService.signin(userSignInDto);
    const accessToken = await this.usersService.accessToken(user);
    console.log(accessToken);
    console.log(user);
    return { accessToken, user };
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('all')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserEntity],
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: UserEntity,
  })
  getProfile(@CurrentUser() currentUser: UserEntity) {
    console.log('currentUser', currentUser);
    return currentUser;
  }
}
