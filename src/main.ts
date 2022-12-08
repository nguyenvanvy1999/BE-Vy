import { Logger, VersioningType } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { initDocs } from '@src/configs';
import type { IDocsConfig } from '@src/configs/env/config';
import { useContainer } from 'class-validator';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { defaultRouteVersion } from './configs';
import { AppModule } from './modules/app/app.module';

async function bootstrap(): Promise<void> {
  try {
    {
      const app = await NestFactory.create(AppModule, { bufferLogs: true });
      app.enableCors({ origin: '*' });
      app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
      const config: ConfigService = app.select(ConfigModule).get(ConfigService);
      const logger = new Logger();

      const env: string = config.get<string>('app.env');
      const tz: string = config.get<string>('app.timezone');
      const host: string = config.get<string>('app.http.host');
      const port: number = config.get<number>('app.http.port');
      const isEnableVersioning: boolean = config.get<boolean>('app.versioning');
      const docs: IDocsConfig = config.get<IDocsConfig>('docs');

      process.env.TZ = tz;
      process.env.NODE_ENV = env;

      if (isEnableVersioning) {
        app.enableVersioning({
          type: VersioningType.URI,
          defaultVersion: defaultRouteVersion,
        });
      }

      app.setGlobalPrefix('/api');
      useContainer(app.select(AppModule), { fallbackOnErrors: true });

      await initDocs(app, docs);

      await app.listen(port, host);

      const appUrl = await app.getUrl();

      logger.log('==========================================================');
      logger.log(`App Environment: ${env}`, 'NestApplication');
      logger.log(
        `App Language   : ${config.get<string>('app.language')}`,
        'NestApplication',
      );
      logger.log(
        `App Debug      : ${config.get<boolean>('app.debug')}`,
        'NestApplication',
      );
      logger.log(`App Versioning : ${isEnableVersioning}`, 'NestApplication');
      logger.log(
        `App Http       : ${config.get<boolean>('app.httpOn')}`,
        'NestApplication',
      );
      logger.log(
        `App Task       : ${config.get<boolean>('app.taskOn')}`,
        'NestApplication',
      );
      logger.log(`App Timezone   : ${tz}`, 'NestApplication');
      logger.log(
        `Database Debug : ${config.get<boolean>('database.debug')}`,
        'NestApplication',
      );
      logger.log('==========================================================');
      logger.log(
        `Database running on : ${config.get<string>(
          'database.host',
        )}/${config.get<string>('database.name')}`,
        'NestApplication',
      );
      logger.log(`Server running on   : ${appUrl}`, 'NestApplication');
      logger.log('==========================================================');

      if (docs.swagger.enable) {
        logger.log(
          `Swagger running  : ${appUrl}/swagger/admin`,
          'NestApplication',
        );
        logger.log(
          `                 : ${appUrl}/swagger/public`,
          'NestApplication',
        );
        logger.log(
          `                 : ${appUrl}/swagger/common`,
          'NestApplication',
        );
        logger.log(
          `                 : ${appUrl}/swagger/webhook`,
          'NestApplication',
        );
      } else {
        logger.log('Swagger document disable', 'NestApplication');
      }

      if (docs.redoc.enable) {
        logger.log(`AsyncAPI running : ${appUrl}/async-api`, 'NestApplication');
      } else {
        logger.log('AsyncAPI document disable', 'NestApplication');
      }

      logger.log('==========================================================');
    }
  } catch (error) {
    throw new Error(error);
  }
}

bootstrap().catch((error) => console.log('Start server error', error));
