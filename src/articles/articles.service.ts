import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { User } from '../users/entities/user.entity';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleResponseInterface } from './types/article-response.interface';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  private static generateSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  buildArticleResponse(article: Article): ArticleResponseInterface {
    return { article };
  }

  async create(user: User, dto: CreateArticleDto): Promise<Article> {
    const article = new Article();
    Object.assign(article, dto);

    article.author = user;
    article.slug = ArticlesService.generateSlug(article.title);
    if (!article.tagList) article.tagList = [];

    return await this.articleRepository.save(article);
  }

  // findAll() {
  //   return `This action returns all articles`;
  // }

  async findOne(slug: string): Promise<Article> {
    return await this.articleRepository.findOne({ slug });
  }

  // update(id: number, updateArticleDto: UpdateArticleDto) {
  //   return `This action updates a #${id} article`;
  // }

  async remove(userId: string, slug: string) {
    const article = await this.findOne(slug);

    if (!article) {
      throw new NotFoundException('article not found');
    } else if (article.author.id !== userId) {
      throw new ForbiddenException('you can only delete your own articles');
    } else {
      return await this.articleRepository.delete({ slug });
    }
  }
}
