import { ApiProperty } from '@nestjs/swagger';
import { EPermissions } from '@src/modules/permission/permission.constant';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RoleCreateReqDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  @Type(() => String)
  @ApiProperty({ type: String, required: true, description: 'Code of role', example: '__admin__' })
  readonly code: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  @Type(() => String)
  @ApiProperty({ type: String, required: true, description: 'Name of role', example: 'Admin' })
  readonly name: string;

  @IsNotEmpty()
  @IsEnum(EPermissions, { each: true })
  @ApiProperty({ description: 'Permissions', isArray: true, enum: EPermissions, enumName: 'EPermissions' })
  readonly permissions: EPermissions[];
}
