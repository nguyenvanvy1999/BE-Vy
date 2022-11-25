import 'winston-daily-rotate-file';

import { Module } from '@nestjs/common';
import appRoot from 'app-root-path';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import winston from 'winston';

import { CustomConfigModule, CustomConfigService } from '../env';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: (config: CustomConfigService) => {
        const transports: winston.transport[] = [
          new winston.transports.DailyRotateFile({
            filename: 'application-%DATE%.log',
            dirname: `${appRoot}/logs/`,
            level: 'info',
            handleExceptions: true,
            handleRejections: true,
            json: true,
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            utc: true,
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              winston.format.json(),
              winston.format.label(),
              winston.format.logstash(),
              winston.format.label(),
              winston.format.metadata(),
            ),
          }),
        ];
        if (!config.isProduction) {
          transports.push(
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                nestWinstonModuleUtilities.format.nestLike('DoAn', {
                  prettyPrint: true,
                }),
              ),
              level: 'info',
            }),
          );
        }

        return {
          transports,
          exitOnError: false,
        };
      },
      inject: [CustomConfigService],
      imports: [CustomConfigModule],
    }),
  ],
})
export class CustomLoggerModule {}
