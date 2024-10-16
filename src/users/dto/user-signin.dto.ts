import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UserSignInDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the user',
  })
  @IsNotEmpty({ message: 'email can not be empty.' })
  @IsEmail({}, { message: 'Pleadse provide a valid email.' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @IsNotEmpty({ message: 'Password can not be empty.' })
  @MinLength(5, { message: 'Passwod minimum character should be 5.' })
  password: string;
}
