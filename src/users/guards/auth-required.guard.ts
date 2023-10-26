import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ExpressRequestInterface } from 'src/interfaces/express-request.interface';

export class AuthRequiredGuard implements CanActivate {
  // give access to resource if userId in req
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<ExpressRequestInterface>();
    if (request.userId) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
