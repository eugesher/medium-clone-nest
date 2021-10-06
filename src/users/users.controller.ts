import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './types/user-response.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body('user') dto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    switch (true) {
      case await this.usersService.checkEmailIsTaken(dto):
        throw new UnprocessableEntityException('Email is already taken');
      case await this.usersService.checkUsernameIsTaken(dto):
        throw new UnprocessableEntityException('Username is already taken');
      default:
        const user = await this.usersService.create(dto);
        return this.usersService.buildUserResponse(user);
    }
  }
}
