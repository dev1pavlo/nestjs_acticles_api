import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { UsersModule } from '../users/users.module';
import { ArticleRepository } from './repositories/article.repository';

@Module({
  imports: [UsersModule],
  providers: [ArticlesService, ArticleRepository],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
