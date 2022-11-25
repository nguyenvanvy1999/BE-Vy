import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ECollectionName } from '../utils/database';

import { LoggerSchema } from './schemas/logger.schema';
import { LoggerService } from './services';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [
    MongooseModule.forFeature([
      {
        name: ECollectionName.LOGGER,
        schema: LoggerSchema,
        collection: ECollectionName.LOGGER,
      },
    ]),
  ],
})
export class LoggerModule {}
