import type { NestMiddleware } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ERequestStatusCodeError } from '@src/modules/utils/request/request.constant';
import type { IRequestApp } from '@src/modules/utils/request/request.interface';
import type { NextFunction, Response } from 'express';
import userAgentParser from 'ua-parser-js';

@Injectable()
export class UserAgentMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: IRequestApp, res: Response, next: NextFunction): void {
    const env: string = this.configService.get<string>('app.env');

    if (env === 'production' || env === 'staging') {
      const userAgent: string = req.headers['user-agent'];

      if (!userAgent) {
        throw new ForbiddenException({
          statusCode: ERequestStatusCodeError.REQUEST_USER_AGENT_INVALID_ERROR,
          message: 'middleware.error.userAgentInvalid',
        });
      }
    }

    req.userAgent = userAgentParser(req.headers['user-agent']);
    next();
  }
}
