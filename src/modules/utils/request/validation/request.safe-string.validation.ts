import { Injectable } from '@nestjs/common';
import { HelperStringService } from '@src/modules/utils/helper/service/helper.string.service';
import type {
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class SafeStringConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly helperStringService: HelperStringService) {}

  validate(value: string): boolean {
    return value ? this.helperStringService.checkSafeString(value) : false;
  }
}

export function SafeString(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'SafeString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: SafeStringConstraint,
    });
  };
}
