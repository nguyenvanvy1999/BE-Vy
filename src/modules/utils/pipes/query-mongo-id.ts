import type { PipeTransform } from '@nestjs/common';
import { Query } from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import { MongoIdPipe } from '@src/configs';

export const QueryMongoId = (
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator => Query(property, MongoIdPipe, ...pipes);
