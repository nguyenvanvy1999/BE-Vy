import { Module } from '@nestjs/common';
import { AuthModule } from '@src/modules/auth';
import { CoreModule } from '@src/modules/core.module';
import { RoleAdminController } from '@src/modules/role/controllers/role.admin.controller';
import { RoleModule } from '@src/modules/role/role.module';
import { SettingAdminController } from '@src/modules/setting/controllers/setting.admin.controller';
import { SettingModule } from '@src/modules/setting/setting.module';
import { UserAdminController } from '@src/modules/user/controllers';
import { UserModule } from '@src/modules/user/user.module';

@Module({
  imports: [RoleModule, SettingModule, UserModule, AuthModule, CoreModule],
  controllers: [RoleAdminController, SettingAdminController, UserAdminController],
})
export class RouterAdminModule {}
