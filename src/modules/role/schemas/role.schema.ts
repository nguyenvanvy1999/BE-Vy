import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@src/modules/base/schemas';
import { EPermissions } from '@src/modules/permission/permission.constant';
import type { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class RoleSchema extends BaseSchema {
  @Prop({
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  code: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    type: Array,
    default: [],
    enums: [{ type: String, enum: EPermissions }],
  })
  permissions: EPermissions[];

  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean;
}

export const roleDatabaseName = 'roles';

export const roleModel = SchemaFactory.createForClass(RoleSchema);

export type RoleDocument = RoleSchema & Document;
