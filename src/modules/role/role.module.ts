import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionModule } from '@src/modules/permission/permission.module';
import { roleDatabaseName, roleModel, RoleSchema } from '@src/modules/role/schemas';
import { RoleBulkService } from '@src/modules/role/services';
import { HelperModule } from '@src/modules/utils/helper/helper.module';

import { RoleService } from './services/role.service';

@Module({
  providers: [RoleService, RoleBulkService],
  exports: [RoleService, RoleBulkService],
  imports: [
    MongooseModule.forFeature([
      {
        name: RoleSchema.name,
        schema: roleModel,
        collection: roleDatabaseName,
      },
    ]),
    PermissionModule,
    HelperModule,
  ],
})
export class RoleModule {}
