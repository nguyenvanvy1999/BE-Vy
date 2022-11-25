import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const ReqUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
