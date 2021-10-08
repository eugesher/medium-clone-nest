import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProfileType } from './types/profile.type';
import { ProfileResponseInterface } from './types/profile-response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile };
  }

  async follow(userId: string, username: string): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({ username });

    if (!profile) {
      throw new NotFoundException('profile not found');
    }

    if (userId === profile.id) {
      throw new BadRequestException('it is impossible to follow yourself ');
    }

    const follow = await this.followRepository.findOne({
      followerId: userId,
      followingId: profile.id,
    });

    if (!follow) {
      const followToCreate = new Follow();
      followToCreate.followerId = userId;
      followToCreate.followingId = profile.id;
      await this.followRepository.save(followToCreate);
    }

    return { ...profile, following: true };
  }

  // findAll() {
  //   return `This action returns all profiles`;
  // }

  async findOne(userId: string, username: string): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({ username });

    if (!profile) throw new NotFoundException('profile not found');

    return { ...profile, following: false };
  }

  // update(id: number, updateProfileDto: UpdateProfileDto) {
  //   return `This action updates a #${id} profile`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} profile`;
  // }
}
