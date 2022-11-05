import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { MessageService } from '@src/modules/message';
import type { IMessage } from '@src/modules/message/message.interface';
import type { IErrorException } from '@src/modules/utils/error/error.interface';
import type { Response } from 'express';

@Catch(HttpException)
export class ErrorHttpFilter implements ExceptionFilter {
  constructor(private readonly messageService: MessageService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const statusHttp: number = exception.getStatus();
    const responseHttp: any = ctx.getResponse<Response>();

    const appLanguages: string[] = ctx.getRequest().i18nLang ? ctx.getRequest().i18nLang.split(',') : undefined;

    // Restructure
    const response = exception.getResponse() as IErrorException;

    if (typeof response === 'object') {
      const { statusCode, message, errors, data, properties } = response;
      const rErrors = errors ? this.messageService.getRequestErrorsMessage(errors, appLanguages) : undefined;

      let rMessage: string | IMessage = this.messageService.get(message, { appLanguages });

      if (properties) {
        rMessage = this.messageService.get(message, {
          appLanguages,
          properties,
        });
      }

      responseHttp.status(statusHttp).json({
        statusCode,
        message: rMessage,
        errors: rErrors,
        data,
      });
    } else {
      const rMessage: string | IMessage = this.messageService.get('response.error.structure', { appLanguages });
      responseHttp.status(statusHttp).json({
        statusCode: 500,
        message: rMessage,
      });
    }
  }
}
