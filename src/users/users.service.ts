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

  buildUserResponse(
    user: User,
    options = { withToken: false },
  ): UserResponseInterface {
    return {
      user: {
        ...user,
        token: options.withToken ? this.generateJwt(user) : undefined,
      },
    };
  }

  async create(dto: CreateUserDto): Promise<User> {
    switch (true) {
      case !!(await this.userRepository.findOne({ email: dto.email })):
        throw new UnprocessableEntityException('email is already taken');
      case !!(await this.userRepository.findOne({ username: dto.username })):
        throw new UnprocessableEntityException('username is already taken');
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
        throw new ForbiddenException('invalid credentials');
      case await compare(dto.password, user.password):
        throw new ForbiddenException('invalid credentials');
      default:
        delete user.password;
        return user;
    }
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }
}
