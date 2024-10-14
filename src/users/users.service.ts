import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';
import { Roles } from 'src/utility/common/user-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    try{
    const userExists = await this.findUserByEmail(userSignUpDto.email);
    if (userExists) throw new BadRequestException('Email alreadyy exists.');
    userSignUpDto.password = await hash(userSignUpDto.password, 10);
     // If roles are not provided, set to default [Roles.USER]
     const roles = userSignUpDto.roles || [Roles.USER];
    let user = this.usersRepository.create({...userSignUpDto, roles});  
    console.log('New user created with roles:', user);
    user = await this.usersRepository.save(user);
    delete user.password;
    return user;
  }catch(error){
  console.log(error); 
  throw new BadRequestException('An error occurred during sign up.');
}
  }

  async signin(userSignInDto: UserSignInDto): Promise<UserEntity> {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userSignInDto.email })
      .getOne();
    if (!userExists) throw new BadRequestException('Bad creadentials.');
    const matchPassword = await compare(
      userSignInDto.password,
      userExists.password,
    );
    if (!matchPassword) throw new BadRequestException('Bad creadentials.');
    delete userExists.password;
    return userExists;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found.');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async accessToken(user: UserEntity): Promise<string> {
    const token = sign(
      { id: user.id, email: user.email, roles: user.roles },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME },
    );
    console.log('Access token generated for user:', token, user.roles);
    return token;
  }
}
