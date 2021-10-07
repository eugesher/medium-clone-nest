import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from '../users/guards/auth.guard';
import { UserDecorator } from '../users/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { ArticleResponseInterface } from './types/article-response.interface';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @UserDecorator() user: User,
    @Body('article') dto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.create(user, dto);
    return this.articlesService.buildArticleResponse(article);
  }

  // @Get()
  // findAll() {
  //   return this.articlesService.findAll();
  // }

  @Get(':slug')
  async findOne(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.findOne(slug);
    return this.articlesService.buildArticleResponse(article);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
  //   return this.articlesService.update(+id, updateArticleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.articlesService.remove(+id);
  // }
}
