import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'user' })
  @IsOptional()
  @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
  role?: 'user' | 'admin';
}
