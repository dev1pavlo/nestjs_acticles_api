import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ArticleRepository } from './repositories/article.repository';
import { IArticle } from './interfaces/article.interface';
import { UpdateArticleDto } from './dtos/update-artickle.dto';
import { UserRepository } from './../users/repositories/user.repository';
import { CreateArticleDto } from './dtos/create-article.dto';


@Injectable()
export class ArticlesService {
    constructor(
        private readonly articleRepository: ArticleRepository,
        private readonly userRepository: UserRepository
    ) { }

    create(userId:number, createdArticle: CreateArticleDto): IArticle {
        const user = this.userRepository.findById(userId)
        if (!user) {
            throw new UnauthorizedException()
        }
        return this.articleRepository.create(userId, createdArticle)
    }

    update(articleId, userId, updatedArticle: UpdateArticleDto): IArticle {
        const article = this.articleRepository.getOneById(articleId)
        if (!article) {
            throw new HttpException('Article doesn\'t exist', HttpStatus.NOT_FOUND)
        }
        if (article.authorId !== userId) {
            throw new HttpException('You are not an author', HttpStatus.FORBIDDEN)
        }
        return this.articleRepository.update(articleId, updatedArticle)
    }

    getAll(): IArticle[] {
        return this.articleRepository.getAll()
    }

    getOne(id: number): IArticle {
        const article = this.articleRepository.getOneById(id)
        if (!article) {
            throw new HttpException('Article doesn\'t exist', HttpStatus.NOT_FOUND)
        }
        return article
    }

    deleteOne(articleId: number, userId: number): IArticle  {
        const article = this.articleRepository.getOneById(articleId)
        if (!article) {
            throw new HttpException('Article doesn\'t exist', HttpStatus.NOT_FOUND)
        }
        if (article.authorId !== userId) {
            throw new HttpException('You are not an author', HttpStatus.FORBIDDEN)
        }
    
        return this.articleRepository.delete(articleId)
    }
}
