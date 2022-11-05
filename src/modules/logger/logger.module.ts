import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@src/configs/database/database.constant';

import { LoggerDatabaseName, loggerModel, LoggerSchema } from './schemas/logger.schema';
import { LoggerService } from './services';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: LoggerSchema.name,
          schema: loggerModel,
          collection: LoggerDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class LoggerModule {}
