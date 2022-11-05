import { ApiProperty, OmitType } from '@nestjs/swagger';
import { EPermissions } from '@src/modules/permission/permission.constant';
import { RoleResDTO } from '@src/modules/role/dtos/role.dto';

export class PermissionMapDTO {
  @ApiProperty({
    description: 'Permission name',
    nullable: false,
    required: true,
    enum: EPermissions,
    enumName: 'EPermissions',
    example: EPermissions.Authenticated,
    type: String,
  })
  readonly permission!: EPermissions;

  @ApiProperty({ description: 'Active', type: Boolean, required: true, nullable: false, example: false })
  readonly isActive!: boolean;
}

export class RoleDetailResDTO extends OmitType(RoleResDTO, ['updatedAt', 'permissions']) {
  @ApiProperty({
    type: [PermissionMapDTO],
    description: 'Mapped permission',
    isArray: true,
    nullable: false,
    required: true,
    example: [
      { permission: EPermissions.Authenticated, isActive: true },
      { permission: EPermissions.CreateRole, isActive: false },
    ],
  })
  readonly mappedPermissions!: PermissionMapDTO[];
}
