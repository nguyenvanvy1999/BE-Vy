import {
  applyDecorators,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  UnprocessableEntityException,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationError,
  ValidationPipe,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { ApplyDecorator } from '@src/types';
import { ErrorHttpFilter } from '../error/error.filter';
import { ERequestStatusCodeError } from '../request/request.constant';

export const HttpControllerInit = (
  tag: string,
  path?: string,
  version?: string,
): ApplyDecorator =>
  applyDecorators(
    Controller({
      path: path ?? tag.toLowerCase(),
      version: version ?? VERSION_NEUTRAL,
    }),
    ApiTags(tag),
    UseInterceptors(ClassSerializerInterceptor),
    UseFilters(ErrorHttpFilter),
    UsePipes(
      new ValidationPipe({
        transform: true,
        skipNullProperties: false,
        skipUndefinedProperties: false,
        skipMissingProperties: false,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        exceptionFactory: (errors: ValidationError[]) =>
          new UnprocessableEntityException({
            statusCode: ERequestStatusCodeError.REQUEST_VALIDATION_ERROR,
            message: 'http.clientError.unprocessableEntity',
            errors,
          }),
      }),
    ),
  );
