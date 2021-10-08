import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { User } from '../users/entities/user.entity';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { ArticleResponseInterface } from './types/article-response.interface';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesResponseInterface } from './types/articles-response.interface';
import { Follow } from '../profiles/entities/follow.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
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

  async findAll(
    userId: string,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = getRepository(Article)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .orderBy('articles.created_at', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.tag) {
      queryBuilder.andWhere('articles.tag_list LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        username: query.author,
      });
      queryBuilder.andWhere('articles.author_id = :id', { id: author.id });
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne(
        {
          username: query.favorited,
        },
        { relations: ['favorites'] },
      );
      const ids = author.favorites.map((article) => article.id);
      if (ids.length) {
        queryBuilder.andWhere('articles.authorId IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('0=1');
      }
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: string[] = [];

    if (userId) {
      const currentUser = await this.userRepository.findOne(userId, {
        relations: ['favorites'],
      });
      favoriteIds = currentUser.favorites.map((article) => article.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorites = articles.map((article) => {
      const liked = favoriteIds.includes(article.id);
      return { ...article, liked };
    });

    return { articles: articlesWithFavorites, articlesCount };
  }

  async getFeed(
    userId: string,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepository.find({ followerId: userId });

    if (!follows.length) {
      return { articles: [], articlesCount: 0 };
    }

    const followingUserIds = follows.map((follow) => follow.followingId);
    const queryBuilder = getRepository(Article)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.author_id IN (:...ids)', { ids: followingUserIds })
      .orderBy('articles.created_at', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

  async findOne(slug: string): Promise<Article> {
    return await this.articleRepository.findOne({ slug });
  }

  async update(
    userId: string,
    slug: string,
    dto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.findOne(slug);

    if (!article) {
      throw new NotFoundException('article not found');
    } else if (article.author.id !== userId) {
      throw new ForbiddenException('you can only delete your own articles');
    } else {
      Object.assign(article, dto);
      return await this.articleRepository.save(article);
    }
  }

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

  async addToFavorites(userId: string, slug: string): Promise<Article> {
    const article = await this.findOne(slug);
    const user = await this.userRepository.findOne(userId, {
      relations: ['favorites'],
    });
    const isNotLiked =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1;

    if (isNotLiked) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async removeFromFavorites(userId: string, slug: string): Promise<Article> {
    const article = await this.findOne(slug);
    const user = await this.userRepository.findOne(userId, {
      relations: ['favorites'],
    });
    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }
}
