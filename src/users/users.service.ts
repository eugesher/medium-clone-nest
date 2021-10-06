import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/user-response.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async checkEmailIsTaken(dto: CreateUserDto): Promise<boolean> {
    const user = await this.userRepository.findOne({
      email: dto.email,
    });

    return !!user;
  }

  async checkUsernameIsTaken(dto: CreateUserDto): Promise<boolean> {
    const user = await this.userRepository.findOne({
      username: dto.username,
    });

    return !!user;
  }

  generateJwt(user: User): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      'dev-key',
    );
  }

  buildUserResponse(user: User): UserResponseInterface {
    return {
      user: { ...user, token: this.generateJwt(user) },
    };
  }

  async create(dto: CreateUserDto): Promise<User> {
    switch (true) {
      case !!(await this.userRepository.findOne({ email: dto.email })):
        throw new UnprocessableEntityException('Email is already taken');
      case !!(await this.userRepository.findOne({ username: dto.username })):
        throw new UnprocessableEntityException('Username is already taken');
      default:
        return await this.userRepository.save(dto);
    }
  }

  async login(dto: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findOne(
      { email: dto.email },
      { select: ['id', 'username', 'email', 'bio', 'image', 'password'] },
    );

    switch (false) {
      case !!user:
        throw new ForbiddenException('Invalid credentials');
      case await compare(dto.password, user.password):
        throw new ForbiddenException('Invalid credentials');
      default:
        delete user.password;
        return user;
    }
  }
}
