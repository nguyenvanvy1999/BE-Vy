import { Injectable } from '@nestjs/common';
import type { TypeOfObj } from '@src/types';
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsStartWithConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const [prefix] = args.constraints;

    return value ? prefix.every((prf: string) => value.startsWith(prf)) : false;
  }
}

export function IsStartWith(
  prefix: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: TypeOfObj, propertyName: string): any {
    registerDecorator({
      name: 'IsStartWith',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [prefix],
      validator: IsStartWithConstraint,
    });
  };
}
