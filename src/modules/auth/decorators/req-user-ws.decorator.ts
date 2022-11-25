import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const ReqWSUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): any => {
    const request = ctx.switchToWs().getClient();
    return request.user;
  },
);
