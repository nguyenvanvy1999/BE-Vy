import { Module } from '@nestjs/common';
import { PermissionService } from '@src/modules/permission/services';

@Module({
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
