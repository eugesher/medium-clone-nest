import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './types/user-response.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { ExpressRequestInterface } from '../types/express-request.interface';

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
  async getCurrent(
    @Req() req: ExpressRequestInterface,
  ): Promise<UserResponseInterface> {
    return this.usersService.buildUserResponse(req.user);
  }
}
