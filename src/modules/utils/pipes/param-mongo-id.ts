import type { PipeTransform } from '@nestjs/common';
import { Param } from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import { MongoIdPipe } from '@src/configs';

export const ParamMongoId = (
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator => Param(property, MongoIdPipe, ...pipes);
