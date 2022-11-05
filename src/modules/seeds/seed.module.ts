import { Logger, Module } from '@nestjs/common';
import { GlobalConfigModule } from '@src/configs';
import { DeviceModule } from '@src/modules/device/device.module';
import { DeviceSeed } from '@src/modules/seeds/services';
import { CommandModule } from 'nestjs-command';

@Module({
  imports: [DeviceModule, CommandModule, GlobalConfigModule],
  providers: [DeviceSeed, Logger],
  exports: [DeviceSeed],
})
export class SeedModule {}
