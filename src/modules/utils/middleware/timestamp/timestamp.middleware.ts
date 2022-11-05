import type { NestMiddleware } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HelperDateService } from '@src/modules/utils/helper/service/helper.date.service';
import { ERequestStatusCodeError } from '@src/modules/utils/request/request.constant';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class TimestampMiddleware implements NestMiddleware {
  constructor(private readonly helperDateService: HelperDateService, private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const env: string = this.configService.get<string>('app.env');

    if (env === 'production' || env === 'staging') {
      const toleranceTimeInMinutes = this.configService.get<number>('middleware.timestamp.toleranceTimeInMinutes');
      const ts: string = req.headers['x-timestamp'] as string;
      const isCheck: boolean = this.helperDateService.check(
        Number.isNaN(Number.parseInt(ts, 10)) ? ts : Number.parseInt(ts, 10),
      );

      if (!ts || !isCheck) {
        throw new ForbiddenException({
          statusCode: ERequestStatusCodeError.REQUEST_TIMESTAMP_INVALID_ERROR,
          message: 'middleware.error.timestampInvalid',
        });
      }

      const timestamp = this.helperDateService.create(
        Number.isNaN(Number.parseInt(ts, 10)) ? ts : Number.parseInt(ts, 10),
      );
      const toleranceMin = this.helperDateService.backwardInMinutes(toleranceTimeInMinutes);
      const toleranceMax = this.helperDateService.forwardInMinutes(toleranceTimeInMinutes);

      if (timestamp < toleranceMin || timestamp > toleranceMax) {
        throw new ForbiddenException({
          statusCode: ERequestStatusCodeError.REQUEST_TIMESTAMP_INVALID_ERROR,
          message: 'middleware.error.timestampInvalid',
        });
      }
    }

    next();
  }
}
