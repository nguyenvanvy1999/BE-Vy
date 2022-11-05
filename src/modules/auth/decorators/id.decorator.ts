import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const Id = createParamDecorator((data: string, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();

  return request.user.id;
});
