import { Controller, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { ProfileResponseInterface } from './types/profile-response.interface';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  // @Post()
  // create(@Body() createProfileDto: CreateProfileDto) {
  //   return this.profilesService.create(createProfileDto);
  // }

  // @Get()
  // findAll() {
  //   return this.profilesService.findAll();
  // }

  @Get(':username')
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profilesService.findOne(userId, username);
    return this.profilesService.buildProfileResponse(profile);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
  //   return this.profilesService.update(+id, updateProfileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.profilesService.remove(+id);
  // }
}
