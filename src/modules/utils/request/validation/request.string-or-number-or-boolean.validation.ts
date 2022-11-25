import { Injectable } from '@nestjs/common';
import { HelperStringService } from '@src/modules/utils/helper/service/helper.string.service';
import type {
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class StringOrNumberOrBooleanConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected readonly helperStringService: HelperStringService) {}

  validate(value: string): boolean {
    if (typeof value === 'boolean') {
      return true;
    }

    return value ? this.helperStringService.checkStringOrNumber(value) : false;
  }
}

export function StringOrNumberOrBoolean(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'StringOrNumberOrBoolean',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: StringOrNumberOrBooleanConstraint,
    });
  };
}
