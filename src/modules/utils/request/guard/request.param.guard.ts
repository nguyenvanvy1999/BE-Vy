import type { CanActivate, ExecutionContext, Type } from '@nestjs/common';
import { BadRequestException, Injectable, mixin } from '@nestjs/common';
import type { ClassConstructor } from 'class-transformer';
import { plainToInstance } from 'class-transformer';
import type { ValidationError } from 'class-validator';
import { validate } from 'class-validator';

import { ERequestStatusCodeError } from '../request.constant';

export function ParamGuard(
  classValidation: Array<ClassConstructor<any>>,
): Type<CanActivate> {
  @Injectable()
  class MixinParamGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const { params } = context.switchToHttp().getRequest();

      for (const cv of classValidation) {
        const request = plainToInstance(cv, params);

        const errors: ValidationError[] = await validate(request);

        if (errors.length > 0) {
          throw new BadRequestException({
            statusCode: ERequestStatusCodeError.REQUEST_VALIDATION_ERROR,
            message: 'http.clientError.badRequest',
            errors,
          });
        }
      }

      return true;
    }
  }

  return mixin(MixinParamGuard);
}
