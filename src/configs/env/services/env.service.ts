import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import type { IGetEnvOptions } from '@src/configs';
import type { TypeOfObj } from '@src/types';

import { Environment } from '../constants';

@Injectable()
export class CustomConfigService {
  private readonly config: TypeOfObj;

  constructor() {
    this.config = process.env;
  }

  public getNumber(key: string, options: IGetEnvOptions<number>): number {
    const value: string = this.config[key.toUpperCase()];

    if (value === undefined) {
      if (typeof options.throwError === 'boolean') {
        throw new ReferenceError(`${key} required`);
      } else if (options.throwError instanceof Error) {
        throw options.throwError;
      } else {
        return options.defaultValue;
      }
    } else {
      const convertedValue = Number(value);

      if (Number.isNaN(convertedValue)) {
        throw new TypeError(`${key} env var is not a number`);
      }

      return convertedValue;
    }
  }

  public getBoolean(key: string, options: IGetEnvOptions<boolean>): boolean {
    const value: string = this.config[key.toUpperCase()];

    if (value === undefined) {
      if (typeof options.throwError === 'boolean') {
        throw new ReferenceError(`${key} required`);
      } else if (options.throwError instanceof Error) {
        throw options.throwError;
      } else {
        return options.defaultValue;
      }
    }

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new TypeError(key + ' env var is not a boolean');
    }
  }

  public getString(key: string, options: IGetEnvOptions<string>): string {
    const value: string = this.config[key.toUpperCase()];

    if (!value) {
      if (typeof options.throwError === 'boolean') {
        throw new ReferenceError(`${key} required`);
      } else if (options.throwError instanceof Error) {
        throw options.throwError;
      } else {
        return options.defaultValue;
      }
    }

    return value.toString().replace(/\\n/g, '\n');
  }

  get isProduction(): boolean {
    return this.getString('APP_ENV', { defaultValue: Environment.DEVELOPMENT }) === Environment.PRODUCTION;
  }
}
