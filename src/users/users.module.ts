import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt/dist';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'jwtseret',
      signOptions: { expiresIn: '60s' }
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UserRepository]
})
export class UsersModule { }
