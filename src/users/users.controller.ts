import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './types/user-response.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { BackendValidationPipe } from '../shared/pipes/backend-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body('user') dto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.usersService.create(dto);
    return this.usersService.buildUserResponse(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new BackendValidationPipe())
  async login(@Body('user') dto: LoginUserDto): Promise<UserResponseInterface> {
    const user = await this.usersService.login(dto);
    return this.usersService.buildUserResponse(user, { withToken: true });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrent(@CurrentUser() user: User): Promise<UserResponseInterface> {
    return this.usersService.buildUserResponse(user);
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  async updateCurrent(
    @CurrentUser('id') id: string,
    @Body('user') dto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, dto);
    return this.usersService.buildUserResponse(user);
  }
}
