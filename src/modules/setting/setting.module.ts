import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ECollectionName } from '../utils/database';

import { SettingSchema } from './schemas/setting.schema';
import { SettingService } from './services/setting.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ECollectionName.SETTING,
        schema: SettingSchema,
        collection: ECollectionName.SETTING,
      },
    ]),
  ],
  exports: [SettingService],
  providers: [SettingService],
})
export class SettingModule {}
