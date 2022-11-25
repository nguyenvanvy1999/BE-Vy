/* eslint-disable @typescript-eslint/naming-convention */
import type { Type } from '@nestjs/common';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import type { ApplyDecorator } from '@src/types';

import { ResponseDefaultInterceptor } from './interceptor/response.default.interceptor';
import { ResponsePagingInterceptor } from './interceptor/response.paging.interceptor';

export const HttpApiResponse = <TModel extends Type<any>>(
  messagePath: string,
  model?: TModel,
  description?: string,
  statusCode?: number,
  isArray = false,
): ApplyDecorator => {
  if (model) {
    const data = isArray
      ? {
          type: 'array',
          items: { $ref: getSchemaPath(model) },
          nullable: false,
          description: 'Data',
        }
      : { $ref: getSchemaPath(model), nullable: false, description: 'Data' };

    return applyDecorators(
      UseInterceptors(ResponseDefaultInterceptor(messagePath, statusCode)),
      ApiExtraModels(model),
      ApiOkResponse({
        description,
        status: statusCode ? statusCode : 'default',
        content: {
          'application-json': {
            schema: {
              properties: {
                data,
                statusCode: {
                  type: 'number',
                  example: 200,
                  nullable: false,
                  description: 'Status code',
                },
                message: {
                  description: 'Message',
                  nullable: false,
                  oneOf: [
                    { type: 'string', example: 'Success' },
                    { type: 'object', example: { key: 'key', value: 'value' } },
                  ],
                },
              },
            },
          },
        },
      }),
    );
  }

  return applyDecorators(
    UseInterceptors(ResponseDefaultInterceptor(messagePath, statusCode)),
  );
};

export const HttpApiResponsePaging = <TModel extends Type<any>>(
  messagePath: string,
  model: TModel,
  description?: string,
  statusCode?: number,
): ApplyDecorator =>
  applyDecorators(
    UseInterceptors(ResponsePagingInterceptor(messagePath, statusCode)),
    ApiExtraModels(model),
    ApiOkResponse({
      description,
      content: {
        'application-json': {
          schema: {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
                description: 'Data',
                nullable: false,
              },
              statusCode: {
                type: 'number',
                example: 200,
                description: 'Status code',
                nullable: false,
              },
              message: {
                description: 'Message',
                nullable: false,
                oneOf: [
                  { type: 'string', example: 'Success' },
                  { type: 'object', example: { a: 'Success', b: '123' } },
                ],
              },
              totalData: {
                type: 'number',
                minimum: 0,
                example: 10,
                description: 'Number of total data',
                nullable: false,
              },
              totalPage: {
                type: 'number',
                minimum: 0,
                example: 2,
                description: 'Number of total page',
                nullable: false,
              },
              currentPage: {
                type: 'number',
                minimum: 0,
                example: 1,
                description: 'Current page',
                nullable: false,
              },
              perPage: {
                type: 'number',
                minimum: 0,
                example: 10,
                description: 'Number of data per page',
                nullable: false,
              },
              availableSearch: {
                type: 'array',
                items: { type: 'string' },
                example: ['key1', 'key2'],
                nullable: true,
                description: 'Keys can search',
              },
              availableSort: {
                type: 'array',
                items: { type: 'string' },
                example: ['sort1', 'sort2'],
                nullable: false,
                description: 'Keys can sort',
              },
            },
          },
        },
      },
    }),
  );
