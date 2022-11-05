import type { PipeTransform } from '@nestjs/common';
import { Param } from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import { UUIDPipe } from '@src/configs';

export const ParamUUID = (property: string, ...pipes: Array<Type<PipeTransform> | PipeTransform>): ParameterDecorator =>
  Param(property, UUIDPipe, ...pipes);
