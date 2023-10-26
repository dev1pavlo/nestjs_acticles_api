import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { IAuthPayload } from './interfaces/auth-payload.interface';
import { IUser } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async generateAuthResponse(user: IUser): Promise<IAuthPayload> {
    return {
      accessToken: await this.jwtService.signAsync({ sub: user.id }),
      user,
    };
  }

  async login(email: string, password: string): Promise<IUser> {
    const user = this.userRepository.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async register(
    email: string,
    password: string,
    passwordConfirm: string,
  ): Promise<IUser> {
    const user = this.userRepository.findByEmail(email);
    if (user) {
      throw new HttpException('User is already exists', HttpStatus.BAD_REQUEST);
    }
    if (password !== passwordConfirm) {
      throw new HttpException('Password mismatch', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const newUser = this.userRepository.create(email, hashPassword);
    return newUser;
  }

  getOneById(userId: number): IUser {
    const user = this.userRepository.findById(userId);
    return user;
  }
}
