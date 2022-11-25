/* eslint-disable @typescript-eslint/naming-convention */
import type { ExecutionContext } from '@nestjs/common';
import {
  applyDecorators,
  createParamDecorator,
  UseGuards,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import type { ApplyDecorator } from '@src/types';
import type { ClassConstructor } from 'class-transformer';
import type { IResult } from 'ua-parser-js';

import { ParamGuard } from './guard/request.param.guard';

export const UserAgent = createParamDecorator(
  (data: string, ctx: ExecutionContext): IResult => {
    const { userAgent } = ctx.switchToHttp().getRequest();

    return userAgent;
  },
);

export function RequestParamGuard(
  ...classValidation: Array<ClassConstructor<any>>
): ApplyDecorator {
  return applyDecorators(UseGuards(ParamGuard(classValidation)));
}

export const HttpApiRequest = (
  summary: string,
  description?: string,
): ApplyDecorator =>
  applyDecorators(
    ApiOperation({ summary, description: description ? description : summary }),
    ApiConsumes('application/json'),
  );
