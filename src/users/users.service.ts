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
    try {
      // Check if the user already exists
      const userExists = await this.findUserByEmail(userSignUpDto.email);
      if (userExists)
        throw new BadRequestException(
          'Email already exists. Please use a different email address.',
        );

      // Hash the password
      userSignUpDto.password = await hash(userSignUpDto.password, 10);

      // Use the provided role from the DTO
      const role = userSignUpDto.role; // Change from roles to role

      // Create a new user entity with the provided data
      let user = this.usersRepository.create({
        ...userSignUpDto, // Spread the DTO properties
        role, // Include the role directly
      });

      console.log('New user created with role:', role); // Update the log message to indicate single role
      user = await this.usersRepository.save(user);
      delete user.password; // Remove password from the returned user object
      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Re-throw specific BadRequestExceptions
      }
      console.error('Signup error:', error);
      throw new BadRequestException('An unexpected error occurred during sign up. Please try again later.');
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    // Find the user by ID
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Merge the user entity with the updated data
    Object.assign(user, updateUserDto);

    // Save the updated user to the database
    return this.usersRepository.save(user); // Corrected here
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
