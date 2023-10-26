import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {JwtModule} from '@nestjs/jwt/dist';
import {UserRepository} from './repositories/user.repository';
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '60m' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, UserRepository],
    exports: [UserRepository],
})
export class UsersModule {
}
