import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './types/user-response.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDecorator } from './decorators/user.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body('user') dto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.usersService.create(dto);
    return this.usersService.buildUserResponse(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async login(@Body('user') dto: LoginUserDto): Promise<UserResponseInterface> {
    const user = await this.usersService.login(dto);
    return this.usersService.buildUserResponse(user, { withToken: true });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrent(
    @UserDecorator() user: User,
  ): Promise<UserResponseInterface> {
    return this.usersService.buildUserResponse(user);
  }
}
