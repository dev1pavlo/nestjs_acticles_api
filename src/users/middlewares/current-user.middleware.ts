import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../interfaces/jwt.payload';
import { ExpressRequestInterface } from 'src/interfaces/express-request.interface';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  // set userId into request if correct token
  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        req.userId = null;
        next();
        return;
      }
      const payload = await this.jwtService.verifyAsync<IJwtPayload>(token, {secret: process.env.JWT_SECRET});
      if (!payload) {
        throw new UnauthorizedException();
      }
      req.userId = payload.sub;
      next();
    } catch (e) {
      req.userId = null;
      next();
    }
  }
}
