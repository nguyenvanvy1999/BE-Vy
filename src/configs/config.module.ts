import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import type { MongooseModuleOptions } from '@nestjs/mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { configModuleSetup } from '@src/configs/env/env.provider';

import { AWSConfigModule } from './aws';
import { DatabaseModule } from './database';
import { DatabaseService } from './database/services';
import { CustomConfigModule } from './env';
import { FilterModule } from './filters';
import { FirebaseConfigModule } from './firebase';
import { CustomLoggerModule } from './log';

@Global()
@Module({
  imports: [
    CustomConfigModule,
    CustomLoggerModule,
    FilterModule,
    AWSConfigModule,
    FirebaseConfigModule,
    DatabaseModule,
    ConfigModule.forRoot(configModuleSetup),
    MongooseModule.forRootAsync({
      imports: [DatabaseModule],
      inject: [DatabaseService],
      useFactory: (databaseService: DatabaseService): MongooseModuleOptions => databaseService.createMongooseOptions(),
    }),
  ],
  exports: [MongooseModule],
})
export class GlobalConfigModule {}
