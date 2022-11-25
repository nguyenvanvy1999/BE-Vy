import { buildTemplatedApiExceptionDecorator } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  applyDecorators,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ErrorExceptionDTO } from '@src/modules/utils/error/error.interface';
import type { ApplyDecorator } from '@src/types';
import { UserNotFoundException } from '../../user/exceptions';

export const HttpApiException =
  buildTemplatedApiExceptionDecorator<ErrorExceptionDTO>({
    statusCode: Number.parseInt('$status', 10),
    timestamp: new Date().toISOString(),
    path: 'path',
    message: '$description',
    errors: [],
    data: {},
  });

export const HttpApiError = (
  errors?: Array<MethodDecorator & ClassDecorator>,
  isUnprocessableError = true,
  isAuthError = false,
  isForbiddenError = false,
): ApplyDecorator => {
  const defaultDecorators = [
    HttpApiException(() => InternalServerErrorException, {
      description: 'InternalServerError',
    }),
  ];
  isUnprocessableError &&
    defaultDecorators.push(
      HttpApiException(() => UnprocessableEntityException, {
        description: 'Unprocessable Entity',
      }),
    );

  isAuthError &&
    defaultDecorators.push(
      HttpApiException(() => UnauthorizedException, {
        description: 'Unauthorized',
      }),
      HttpApiException(() => UserNotFoundException, {
        description: 'User not found',
      }),
    );

  isForbiddenError &&
    defaultDecorators.push(
      HttpApiException(() => ForbiddenException, {
        description: 'ForbiddenResource',
      }),
    );

  if (errors?.length > 0) {
    defaultDecorators.push(...errors);
  }

  return applyDecorators(...defaultDecorators);
};
