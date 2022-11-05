import { ApiProperty, PickType } from '@nestjs/swagger';
import { EPermissions } from '@src/modules/permission/permission.constant';
import { Exclude, Type } from 'class-transformer';

export class RoleResDTO {
  @Type(() => String)
  @ApiProperty({
    type: String,
    nullable: false,
    description: '_id of role',
    example: '628cf56ac077f9b99c42f99f',
    format: 'objectId',
  })
  readonly _id: string;

  @ApiProperty({
    type: Boolean,
    nullable: false,
    description: 'status of role',
    example: true,
  })
  readonly isActive: boolean;

  @ApiProperty({ type: String, nullable: false, description: 'Code of role', example: '__admin__' })
  readonly code: string;

  @ApiProperty({ type: String, nullable: false, description: 'Name of role', example: 'Role' })
  readonly name: string;

  @ApiProperty({
    description: 'Permissions',
    isArray: true,
    enum: EPermissions,
    enumName: 'EPermissions',
    nullable: false,
    example: [EPermissions.UpdateRole, EPermissions.CreateRole],
  })
  readonly permissions: EPermissions[];

  @ApiProperty({ type: Date, nullable: false, description: 'createdAt of role' })
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;
}

export class RoleIdResDTO extends PickType(RoleResDTO, ['_id'] as const) {}
