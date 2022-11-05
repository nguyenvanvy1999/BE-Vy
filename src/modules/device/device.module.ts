import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@src/configs/database/database.constant';
import { DeviceService } from '@src/modules/device/services';
import { DeviceTokenModule } from '@src/modules/device-token/device-token.module';
import { MessageModule } from '@src/modules/message/message.module';
import { HelperModule } from '@src/modules/utils/helper/helper.module';

import { deviceDatabaseName, deviceModel, DeviceSchema } from './schemas';

@Module({
  imports: [
    MessageModule,
    HelperModule,
    MongooseModule.forFeature(
      [{ name: DeviceSchema.name, schema: deviceModel, collection: deviceDatabaseName }],
      DATABASE_CONNECTION_NAME,
    ),
    DeviceTokenModule,
  ],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
