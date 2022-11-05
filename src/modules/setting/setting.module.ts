import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { settingDatabaseName, settingModel, SettingSchema } from './schemas/setting.schema';
import { SettingService } from './services/setting.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SettingSchema.name,
        schema: settingModel,
        collection: settingDatabaseName,
      },
    ]),
  ],
  exports: [SettingService],
  providers: [SettingService],
})
export class SettingModule {}
