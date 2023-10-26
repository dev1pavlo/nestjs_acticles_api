import { UserRepository } from "src/users/repositories/user.repository";
import { IArticle } from "../interfaces/article.interface";
import { UnauthorizedException, HttpException, HttpStatus } from "@nestjs/common";
import { UpdateArticleDto } from "../dtos/update-artickle.dto";
import { CreateArticleDto } from "../dtos/create-article.dto";

export class ArticleRepository {
    private readonly articles: IArticle[] = []

    create(authorId: number, createdArticle: CreateArticleDto): IArticle {
        const newArticle: IArticle = {
            id: this.articles[this.articles.length -1]?.id + 1 || 1,
            ...createdArticle,
            authorId,
            createdAt: new Date(Date.now()).toISOString()
        }
        this.articles.push(newArticle)
        return newArticle
    }

    update(id: number, updatedArticle: UpdateArticleDto): IArticle | undefined {
        const index = this.articles.findIndex(artticle => artticle.id == id);
        if (index === -1) return undefined;
        this.articles[index] = { ...this.articles[index], ...updatedArticle };
        console.log(`Articles ${this.articles}`)
        return this.articles[index];
    }

    getOneById(id: number): IArticle | undefined {
        return this.articles.find(article => article.id == id)
    }

    getAll(): IArticle[] {
        return this.articles
    }

    delete(id: number): IArticle | undefined {
        const index = this.articles.findIndex(artticle => artticle.id === id);
        if (index === -1) return undefined;
        const deletedUser = this.articles.splice(index, 1)[0];
        return deletedUser;
    }
}