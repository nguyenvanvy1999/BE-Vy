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
export class IsPasswordMediumConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected readonly helperStringService: HelperStringService) {}

  validate(value: string, args: ValidationArguments): boolean {
    // At least one upper case English letter, (?=.*?[A-Z])
    // At least one lower case English letter, (?=.*?[a-z])
    // At least one digit, (?=.*?[0-9])
    // Minimum eight in length .{8,} (with the anchors)

    const [length] = args.constraints;

    return value
      ? this.helperStringService.checkPasswordMedium(value, length)
      : false;
  }
}

export function IsPasswordMedium(
  minLength = 8,
  validationOptions?: ValidationOptions,
) {
  return function (object: TypeOfObj, propertyName: string): any {
    registerDecorator({
      name: 'IsPasswordMedium',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [minLength],
      validator: IsPasswordMediumConstraint,
    });
  };
}
