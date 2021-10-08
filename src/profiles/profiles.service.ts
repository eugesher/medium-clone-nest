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

  async findOne(userId: string, username: string): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({ username });

    if (!profile) throw new NotFoundException('profile not found');

    const follow = await this.followRepository.findOne({
      followerId: userId,
      followingId: profile.id,
    });

    return { ...profile, following: Boolean(follow) };
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

  async unfollow(userId: string, username: string): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({ username });

    if (!profile) {
      throw new NotFoundException('profile not found');
    }

    if (userId === profile.id) {
      throw new BadRequestException('it is impossible to follow yourself ');
    }

    await this.followRepository.delete({
      followerId: userId,
      followingId: profile.id,
    });

    return { ...profile, following: false };
  }
}
