import {
  applyDecorators,
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { ApplyDecorator } from '@src/types';

export const HttpControllerInit = (tag: string, path?: string, version?: string): ApplyDecorator =>
  applyDecorators(
    Controller({ path: path ?? tag.toLowerCase(), version: version ?? VERSION_NEUTRAL }),
    ApiTags(tag),
    UseInterceptors(ClassSerializerInterceptor),
  );
