import { ExecutionContext } from '@nestjs/common/interfaces';
import { createParamDecorator } from '@nestjs/common/decorators';
import { ExpressRequestInterface } from 'src/interfaces/express-request.interface';

export const UserDecorator = createParamDecorator(
  (_: any, ctx: ExecutionContext) => {
    const userId = ctx
      .switchToHttp()
      .getRequest<ExpressRequestInterface>().userId;
    return userId;
  },
);
