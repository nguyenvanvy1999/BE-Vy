import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceService } from '@src/modules/device/services';
import { DeviceTokenModule } from '@src/modules/device-token/device-token.module';
import { MessageModule } from '@src/modules/message/message.module';
import { HelperModule } from '@src/modules/utils/helper/helper.module';

import { deviceDatabaseName, deviceModel, DeviceSchema } from './schemas';

@Module({
  imports: [
    MessageModule,
    HelperModule,
    MongooseModule.forFeature([{ name: DeviceSchema.name, schema: deviceModel, collection: deviceDatabaseName }]),
    DeviceTokenModule,
  ],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
