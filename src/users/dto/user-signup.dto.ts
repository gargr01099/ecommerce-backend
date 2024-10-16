import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength,IsIn } from "class-validator";
import { UserSignInDto } from "./user-signin.dto";

export class UserSignUpDto extends UserSignInDto{
    @IsNotEmpty({message:'Name can not be null'})
    @IsString({message:'Name should be string'})
    name:string;

    @IsNotEmpty({message:'Email can not be null'})  
    @IsEmail({},{message:'Email should be valid'})
    email:string;

    @IsNotEmpty({message:'Password can not be null'})   
    @MinLength(8,{message:'Password should be atleast 8 characters long'})
    password:string;

    @IsNotEmpty({ message: 'Role cannot be null' })
    @IsIn(['user', 'admin'], { message: 'Role must be either user or admin' })
    role: 'user' | 'admin';
}