import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, HttpCode } from '@nestjs/common';
import { UpdateArticleDto } from './dtos/update-artickle.dto';
import { AuthRequiredGuard } from '../users/guards/auth-required.guard';
import { UserDecorator } from '../users/decorators/user.decorator';
import { CreateArticleDto } from './dtos/create-article.dto';
import { ArticlesService } from './articles.service';
import { IArticle } from './interfaces/article.interface';
import { IDeleteResult } from '../interfaces/delete-result.interface';

@Controller('articles')
export class ArticlesController {
    constructor(
        private readonly articleService: ArticlesService
    ) {}

    @UseGuards(AuthRequiredGuard)
    @Post()
    create(
        @UserDecorator() userId: number,
        @Body() createdArticle: CreateArticleDto
    ): IArticle {
        return this.articleService.create(userId, createdArticle)
    }

    @Get()
    getAll(): IArticle[] {
        return this.articleService.getAll()
    }

    @Get(':id')
    getOne(@Param('id') id: number): IArticle {
        return this.articleService.getOne(id)
    }

    @UseGuards(AuthRequiredGuard)
    @Put(':id')
    updateOne(
        @UserDecorator() userId: number,
        @Param('id') articleId: number,
        @Body() updatedArticle: UpdateArticleDto
    ): IArticle {
        const art = this.articleService.update(articleId, userId, updatedArticle)
        console.log(art)
        return art
    }

    @HttpCode(204)
    @UseGuards(AuthRequiredGuard)
    @Delete(":id")
    deleteOne(
        @UserDecorator() userId: number,
        @Param('id') articleId: number) {
            this.articleService.deleteOne(articleId, userId)
            return
    }
}
