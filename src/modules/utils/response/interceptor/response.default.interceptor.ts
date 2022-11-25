import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Injectable, mixin } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { TranslateService } from '@src/modules/translate';
import type { ITranslate } from '@src/modules/translate/translate.interface';
import type { TypeOfObj } from '@src/types';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function ResponseDefaultInterceptor(
  messagePath: string,
  customStatusCode?: number,
): Type<NestInterceptor> {
  @Injectable()
  class MixinResponseDefaultInterceptor
    implements NestInterceptor<Promise<any>>
  {
    constructor(private readonly messageService: TranslateService) {}

    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<Promise<any> | string> {
      const ctx: HttpArgumentsHost = context.switchToHttp();
      const responseExpress: any = ctx.getResponse();

      const request: Request = ctx.getRequest<Request>();
      const { headers } = request;

      const appLanguages: string[] = headers['x-custom-lang']
        ? ctx.getRequest().i18nLang.split(',')
        : undefined;

      return next.handle().pipe(
        map(async (response: Promise<TypeOfObj>) => {
          const statusCode: number =
            customStatusCode || responseExpress.statusCode;
          const data: TypeOfObj = await response;
          const message: string | ITranslate =
            this.messageService.get(messagePath, {
              appLanguages,
            }) || this.messageService.get('response.default');

          return {
            statusCode,
            message,
            data,
          };
        }),
      );
    }
  }

  return mixin(MixinResponseDefaultInterceptor);
}
