import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LoggerDatabaseName, loggerModel, LoggerSchema } from './schemas/logger.schema';
import { LoggerService } from './services';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [
    MongooseModule.forFeature([
      {
        name: LoggerSchema.name,
        schema: loggerModel,
        collection: LoggerDatabaseName,
      },
    ]),
  ],
})
export class LoggerModule {}
