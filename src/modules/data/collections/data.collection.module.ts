import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { dataDatabaseName, dataModel, DataSchema } from '../schemas/data.schema';
import { DataCollection } from './data.collection';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DataSchema.name,
        schema: dataModel,
        collection: dataDatabaseName,
      },
    ]),
  ],
  exports: [DataCollection],
  providers: [DataCollection],
  controllers: [],
})
export class DataCollectionModule {}
