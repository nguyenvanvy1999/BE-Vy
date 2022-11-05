import 'dotenv/config';
import 'reflect-metadata';

import type { TypeOfObj } from '@src/types';
import type { ClassConstructor } from 'class-transformer';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

export function envValidate<T>(config: TypeOfObj, classValidator: ClassConstructor<any>): T {
  const validatedConfig: TypeOfObj = plainToClass(classValidator, config, {
    enableImplicitConversion: true,
    exposeDefaultValues: false,
    exposeUnsetFields: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    skipUndefinedProperties: false,
    skipNullProperties: false,
  });

  if (
    validatedConfig?.REDOC_AUTH_ENABLE === true &&
    (!validatedConfig?.REDOC_USERNAME || !validatedConfig?.REDOC_PASSWORD)
  ) {
    errors.push({
      property: 'Missing REDOC_USERNAME or REDOC_PASSWORD',
      constraints: { REDOC: 'Missing REDOC_USERNAME or REDOC_PASSWORD', value: undefined },
    });
  }

  if (errors.length > 0) {
    const missingFields: string[] = [];
    const invalidFields: string[] = [];

    for (const error of errors) {
      typeof error.value === 'undefined' ? missingFields.push(error.property) : invalidFields.push(error.property);
    }

    let errorMessage = `Your .env file was configured incorrectly.
    Please, check .env.example and fix all invalid or missing fields!`;

    if (missingFields.length > 0) {
      errorMessage = `${errorMessage}\n Missing fields:`;

      for (const field of missingFields) {
        errorMessage += `\n\t- ${field}`;
      }
    }

    if (invalidFields.length > 0) {
      errorMessage = `${errorMessage} \n Invalid fields:`;

      for (const field of invalidFields) {
        errorMessage += `\n\t- ${field}`;
      }
    }

    throw new Error(errorMessage);
  }

  return validatedConfig as T;
}
