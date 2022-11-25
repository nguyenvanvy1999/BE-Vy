import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IErrors } from '@src/modules/utils/error/error.interface';
import type { TypeOfObj } from '@src/types';
import type { ValidationError } from 'class-validator';
import { isArray } from 'class-validator';
import { I18nService } from 'nestjs-i18n';

import { ETranslateLanguage } from '../translate.constant';
import type {
  ITranslate,
  ITranslateOptions,
  ITranslateSetOptions,
} from '../translate.interface';

@Injectable()
export class TranslateService {
  private readonly defaultLanguage: string;

  constructor(
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
  ) {
    this.defaultLanguage = this.configService.get<string>('app.language');
  }

  getRequestErrorsMessage(
    requestErrors: ValidationError[],
    appLanguages?: string[],
  ): IErrors[] {
    const messages: IErrors[][] = [];

    for (const transformer of requestErrors) {
      let children: TypeOfObj[] = transformer.children || [];
      let constraints: string[] = transformer.constraints
        ? Object.keys(transformer.constraints)
        : [];
      const errors: IErrors[] = [];
      let property: string = transformer.property;
      let propertyValue: string = transformer.value;

      if (children.length > 0) {
        while (children.length > 0) {
          for (const child of children) {
            property = `${property}.${child.property}`;

            if (child.constraints) {
              constraints = Object.keys(child.constraints);
              children = [];
              propertyValue = child.value;
              break;
            }

            if (child.children.length > 0) {
              children = child.children;
              break;
            }
          }
        }
      }

      for (const constraint of constraints) {
        errors.push({
          property,
          message: this.get(`request.${constraint}`, {
            appLanguages,
            properties: {
              property,
              value: propertyValue,
            },
          }) as string,
        });
      }

      messages.push(errors);
    }

    return messages.flat(1);
  }

  get(key: string, options?: ITranslateOptions): string | ITranslate {
    const { properties, appLanguages } = options
      ? options
      : { properties: undefined, appLanguages: undefined };

    if (appLanguages && isArray(appLanguages) && appLanguages.length > 0) {
      const messages: ITranslate = {};

      for (const appLanguage of appLanguages) {
        messages[appLanguage] = this.setMessage(appLanguage, key, {
          properties,
        });
      }

      if (Object.keys(messages).length === 1) {
        return messages[appLanguages[0]];
      }

      return messages;
    }

    return this.setMessage(this.defaultLanguage, key, {
      properties,
    });
  }

  private setMessage(
    lang: string,
    key: string,
    options?: ITranslateSetOptions,
  ): any {
    return this.i18n.translate(key, {
      lang,
      args: options && options.properties ? options.properties : undefined,
    });
  }

  getLanguages(): string[] {
    return Object.values(ETranslateLanguage);
  }
}
