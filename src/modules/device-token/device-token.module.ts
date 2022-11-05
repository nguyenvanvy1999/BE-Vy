import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { deviceTokenDatabaseName, deviceTokenModel, DeviceTokenSchema } from '@src/modules/device-token/schemas';
import { DeviceTokenService } from '@src/modules/device-token/services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeviceTokenSchema.name, schema: deviceTokenModel, collection: deviceTokenDatabaseName },
    ]),
  ],
  providers: [DeviceTokenService],
  exports: [DeviceTokenService],
})
export class DeviceTokenModule {}
