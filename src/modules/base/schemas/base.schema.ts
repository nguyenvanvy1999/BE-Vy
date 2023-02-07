import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import type { IBase } from '../interfaces';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class BaseSchema extends Document implements IBase {
  @Prop({ type: ObjectId, required: true })
  _id!: ObjectId;

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}
