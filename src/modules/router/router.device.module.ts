import { Module } from '@nestjs/common';
import { DeviceCommonController } from '@src/modules/device/controllers';
import { DeviceModule } from '@src/modules/device/device.module';
import { DeviceTokenModule } from '@src/modules/device-token/device-token.module';
import { CoreModule } from '@src/modules/core.module';

@Module({ imports: [DeviceModule, DeviceTokenModule, CoreModule], controllers: [DeviceCommonController] })
export class RouterDeviceModule {}
