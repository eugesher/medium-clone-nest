import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';
import { Follow } from '../profiles/entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Follow])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
