import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserSignUpDto } from 'src/users/dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from 'src/users/dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    try {
      const userExists = await this.findUserByEmail(userSignUpDto.email);
      if (userExists)
        throw new BadRequestException(
          'Email already exists. Please use a different email address.',
        );

      userSignUpDto.password = await hash(userSignUpDto.password, 10);

      const role = userSignUpDto.role;

      let user = this.usersRepository.create({
        ...userSignUpDto,
        role,
      });

      console.log('New user created with role:', role);
      user = await this.usersRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Signup error:', error);
      throw new BadRequestException(
        'An unexpected error occurred during sign up. Please try again later.',
      );
    }
  }

  async verifyEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email })
      .getOne();

    if (!user) {
      throw new BadRequestException('Invalid email address.');
    }
    return user;
  }
  async verifyPassword(
    providedPassword: string,
    storedPassword: string,
  ): Promise<void> {
    const isMatch = await compare(providedPassword, storedPassword);

    if (!isMatch) {
      throw new BadRequestException('Invalid password.');
    }
  }

  async signin(userSignInDto: UserSignInDto): Promise<UserEntity> {
    const user = await this.verifyEmail(userSignInDto.email);

    await this.verifyPassword(userSignInDto.password, user.password);

    delete user.password;

    return user;
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async accessToken(user: UserEntity): Promise<string> {
    const token = sign(
      { id: user.id, email: user.email, roles: user.role },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME },
    );
    console.log('Access token generated for user:', token, user.role);
    return token;
  }
}
