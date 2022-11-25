import { Injectable } from '@nestjs/common';
import type { TypeOfObj } from '@src/types';
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';

import { HelperStringService } from '../../helper/service/helper.string.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPasswordStrongConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected readonly helperStringService: HelperStringService) {}

  validate(value: string, args: ValidationArguments): boolean {
    // At least one upper case English letter, (?=.*?[A-Z])
    // At least one lower case English letter, (?=.*?[a-z])
    // At least one digit, (?=.*?[0-9])
    // At least one special character, (?=.*?[#?!@$%^&*-])
    // Minimum eight in length .{8,} (with the anchors)

    const [length] = args.constraints;

    return value
      ? this.helperStringService.checkPasswordStrong(value, length)
      : false;
  }
}

export function IsPasswordStrong(
  minLength = 8,
  validationOptions?: ValidationOptions,
) {
  return function (object: TypeOfObj, propertyName: string): any {
    registerDecorator({
      name: 'IsPasswordStrong',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [minLength],
      validator: IsPasswordStrongConstraint,
    });
  };
}
