import { Injectable } from '@nestjs/common';
import type { TypeOfObj } from '@src/types';
import type { ValidatorConstraintInterface } from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class SkipConstraint implements ValidatorConstraintInterface {
  validate(): boolean {
    return true;
  }
}

export function Skip() {
  return function (object: TypeOfObj, propertyName: string): any {
    registerDecorator({
      name: 'Skip',
      target: object.constructor,
      propertyName,
      validator: SkipConstraint,
    });
  };
}
