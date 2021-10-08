import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { ProfileResponseInterface } from './types/profile-response.interface';
import { AuthGuard } from '../users/guards/auth.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':username')
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profilesService.findOne(userId, username);
    return this.profilesService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async follow(
    @CurrentUser('id') userId: string,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profilesService.follow(userId, username);
    return this.profilesService.buildProfileResponse(profile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollow(
    @CurrentUser('id') userId: string,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profilesService.unfollow(userId, username);
    return this.profilesService.buildProfileResponse(profile);
  }
}
