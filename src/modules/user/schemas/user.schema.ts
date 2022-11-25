import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@src/modules/base/schemas';
import type { Document } from 'mongoose';
import {
  EAccountType,
  EAccountTypeList,
  EUserType,
  EUserTypeList,
} from '../constants';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class User extends BaseSchema {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true, enum: EAccountTypeList })
  accountType: EAccountType;

  @Prop({ type: String, required: true, enum: EUserTypeList })
  userType: EUserType;

  @Prop({ type: String, required: true })
  firebaseUid: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
