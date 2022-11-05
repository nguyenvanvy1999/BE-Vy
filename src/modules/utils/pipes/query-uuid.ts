import type { PipeTransform } from '@nestjs/common';
import { Query } from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import { UUIDPipe } from '@src/configs';

export const QueryUUID = (property: string, ...pipes: Array<Type<PipeTransform> | PipeTransform>): ParameterDecorator =>
  Query(property, UUIDPipe, ...pipes);
