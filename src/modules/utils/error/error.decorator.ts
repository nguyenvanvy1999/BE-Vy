/* eslint-disable @typescript-eslint/naming-convention */
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { applyDecorators, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import type { ErrorDTO } from '@src/modules/utils/error/error.interface';
import { ErrorExceptionDTO } from '@src/modules/utils/error/error.interface';
import type { ApplyDecorator, TypeOfObj } from '@src/types';

export const buildTemplatedApiException = (
  statusCode: number,
  message: string,
  errors?: ErrorDTO[],
  properties?: TypeOfObj,
): ErrorExceptionDTO => ({
  statusCode,
  message,
  errors,
  properties,
});

export const HttpApiError = (
  errors?: Array<MethodDecorator & ClassDecorator>,
  description?: string,
): ApplyDecorator => {
  const defaultDecorators = [
    ApiException(() => InternalServerErrorException, {
      description: description || 'InternalServerError',
      template: {
        statusCode: 5990,
        message: 'InternalServerError',
      },
      type: () => ErrorExceptionDTO,
    }),
    ApiException(() => UnprocessableEntityException, {
      description: 'Unprocessable Entity',
      template: {
        statusCode: 5991,
        message: 'Unprocessable Entity',
        errors: [
          {
            property: 'SN',
            message: 'SN cannot be empty.',
          },
          {
            property: 'SN',
            message: 'SN should be a type of string.',
          },
          {
            property: 'deviceMAC',
            message: 'deviceMAC cannot be empty.',
          },
          {
            property: 'deviceMAC',
            message: 'request.isMacAddress',
          },
        ],
      },
      type: () => ErrorExceptionDTO,
    }),
  ];

  if (errors?.length > 0) {
    defaultDecorators.push(...errors);
  }

  return applyDecorators(...defaultDecorators);
};
