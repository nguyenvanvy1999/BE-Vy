import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { TranslateService } from '@src/modules/translate';
import type { ITranslate } from '@src/modules/translate/translate.interface';
import type {
  ErrorExceptionDTO,
  IErrorException,
} from '@src/modules/utils/error/error.interface';
import type { Response, Request } from 'express';

@Catch(HttpException)
export class ErrorHttpFilter implements ExceptionFilter {
  constructor(private readonly messageService: TranslateService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const statusHttp: number = exception.getStatus();
    const responseHttp: Response = ctx.getResponse<Response>();
    const requestHttp: Request = ctx.getRequest<Request>();

    const appLanguages: string[] = ctx.getRequest().i18nLang
      ? ctx.getRequest().i18nLang.split(',')
      : undefined;

    // Restructure
    const response = exception.getResponse() as IErrorException;
    const errorResponse: ErrorExceptionDTO = {
      path: requestHttp.path,
      statusCode: 500,
      message: '',
      timestamp: new Date().toISOString(),
    };

    if (typeof response === 'object') {
      const { statusCode, message, errors, data, properties } = response;
      const rErrors = errors
        ? this.messageService.getRequestErrorsMessage(errors, appLanguages)
        : undefined;

      let rMessage: string | ITranslate = this.messageService.get(message, {
        appLanguages,
      });

      if (properties) {
        rMessage = this.messageService.get(message, {
          appLanguages,
          properties,
        });
      }
      errorResponse.statusCode = statusCode;
      errorResponse.message = rMessage as string;
      errorResponse.data = data;
      errorResponse.message = rMessage as string;
      errorResponse.errors = rErrors;
    } else {
      const rMessage: string | ITranslate = this.messageService.get(
        'response.error.structure',
        { appLanguages },
      );
      errorResponse.message = rMessage as string;
    }
    responseHttp.status(statusHttp).json(errorResponse);
  }
}
