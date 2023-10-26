import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { CurrentUserMiddleware } from './users/middlewares/current-user.middleware';
import { ArticlesModule } from './articles/articles.module';
import {JwtService} from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UsersModule,
    ArticlesModule,
  ],
  providers: [JwtService]
})
export class AppModule {
  // apply current user middleware to all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
