import {
  ForbiddenException,
  Injectable,
  NotFoundException,
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
import { UpdateUserDto } from './dto/update-user.dto';

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
        const user = new User();
        Object.assign(user, dto);
        return await this.userRepository.save(user);
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
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    } else {
      return user;
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return await this.userRepository.save(user);
  }
}
