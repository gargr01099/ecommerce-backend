import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
} from 'class-validator';
import { UserSignInDto } from 'src/users/dto/user-signin.dto';
import { ApiProperty } from '@nestjs/swagger';
export class UserSignUpDto extends UserSignInDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
  @IsNotEmpty({ message: 'Name can not be null' })
  @IsString({ message: 'Name should be string' })
  name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the user',
  })
  @IsNotEmpty({ message: 'Email can not be null' })
  @IsEmail({}, { message: 'Email should be valid' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @IsNotEmpty({ message: 'Password can not be null' })
  @MinLength(8, { message: 'Password should be atleast 8 characters long' })
  password: string;

  @ApiProperty({
    example: 'user',
    enum: ['user', 'admin'],
    description: 'Role of the user',
  })
  @IsNotEmpty({ message: 'Role cannot be null' })
  @IsIn(['user', 'admin'], { message: 'Role must be either user or admin' })
  role: 'user' | 'admin';
}
