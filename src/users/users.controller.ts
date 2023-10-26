import { Controller, Get, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { IAuthPayload } from './interfaces/auth-payload.interface';
import { UsersService } from './users.service';
import { RegisterDto } from './dtos/register.dto';
import { AuthRequiredGuard } from './guards/auth-required.guard';
import { UserDecorator } from './decorators/user.decorator';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }


    @HttpCode(200)
    @Post('login')
    async login(@Body() { email, password }: LoginDto): Promise<IAuthPayload> {
        const user = await this.usersService.login(email, password)
        return await this.usersService.generateAuthResponse(user)
    }

    @HttpCode(201)
    @Post('register')
    async register(@Body() { email, password, passwordConfirm }: RegisterDto): Promise<IAuthPayload> {
        const user = await this.usersService.register(email, password, passwordConfirm)
        return await this.usersService.generateAuthResponse(user)
    }

    @HttpCode(200)
    @UseGuards(AuthRequiredGuard)
    @Get('me')
    currentUser(@UserDecorator() userId: number) {
        return this.usersService.getOneById(userId)
    }
}
