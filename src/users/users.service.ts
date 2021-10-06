import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/user-response.interface';

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
    const user = new User();
    Object.assign(user, dto);

    return await this.userRepository.save(user);
  }
}
