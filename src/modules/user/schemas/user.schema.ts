import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@src/modules/base/schemas';
import { RoleSchema } from '@src/modules/role/schemas';
import type { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class UserSchema extends BaseSchema {
  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  firstName: string;

  @Prop({
    required: false,
    index: true,
    lowercase: true,
    trim: true,
  })
  lastName?: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    trim: true,
  })
  mobileNumber: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: RoleSchema.name }],
  })
  roles: Types.ObjectId[];

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
  })
  passwordExpired: Date;

  @Prop({
    required: true,
  })
  salt: string;

  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean;
}

export const userDatabaseName = 'users';
export const userModel = SchemaFactory.createForClass(UserSchema);

export type UserDocument = UserSchema & Document;
