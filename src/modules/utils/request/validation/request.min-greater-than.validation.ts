import { Injectable } from '@nestjs/common';
import type { TypeOfObj } from '@src/types';
import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class MinGreaterThanConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const [property] = args.constraints;
    const relatedValue = args.object[property];

    return value > relatedValue;
  }
}

export function MinGreaterThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: TypeOfObj, propertyName: string): any {
    registerDecorator({
      name: 'MinGreaterThan',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MinGreaterThanConstraint,
    });
  };
}
