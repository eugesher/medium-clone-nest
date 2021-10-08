import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileType } from './types/profile.type';
import { ProfileResponseInterface } from './types/profile-response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    return { profile };
  }

  // create(createProfileDto: CreateProfileDto) {
  //   return 'This action adds a new profile';
  // }
  // findAll() {
  //   return `This action returns all profiles`;
  // }

  async findOne(userId: string, username: string): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({ username });

    if (!profile) throw new NotFoundException('profile not found');

    delete profile.email;
    return { ...profile, following: false };
  }

  // update(id: number, updateProfileDto: UpdateProfileDto) {
  //   return `This action updates a #${id} profile`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} profile`;
  // }
}
