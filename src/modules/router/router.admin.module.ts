import { Module } from '@nestjs/common';
import { SettingAdminController } from '@src/modules/setting/controllers/setting.admin.controller';
import { SettingModule } from '@src/modules/setting/setting.module';
import { CoreModule } from '@src/modules/core.module';

@Module({
  imports: [SettingModule, CoreModule],
  controllers: [SettingAdminController],
})
export class RouterAdminModule {}
