import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UsePipes,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from '../users/guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ArticleResponseInterface } from './types/article-response.interface';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesResponseInterface } from './types/articles-response.interface';
import { BackendValidationPipe } from '../shared/pipes/backend-validation.pipe';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @CurrentUser() user: User,
    @Body('article') dto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.create(user, dto);
    return this.articlesService.buildArticleResponse(article);
  }

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('') query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articlesService.findAll(userId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @CurrentUser('id') userId: string,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articlesService.getFeed(userId, query);
  }

  @Get(':slug')
  async findOne(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.findOne(slug);
    return this.articlesService.buildArticleResponse(article);
  }

  @Patch(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @CurrentUser('id') userId: string,
    @Param('slug') slug: string,
    @Body('article') dto: UpdateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.update(userId, slug, dto);
    return this.articlesService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async remove(@CurrentUser('id') userId: string, @Param('slug') slug: string) {
    return this.articlesService.remove(userId, slug);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addToFavorites(
    @CurrentUser('id') userId: string,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.addToFavorites(userId, slug);
    return this.articlesService.buildArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async removeFromFavorites(
    @CurrentUser('id') userId: string,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.removeFromFavorites(
      userId,
      slug,
    );
    return this.articlesService.buildArticleResponse(article);
  }
}
