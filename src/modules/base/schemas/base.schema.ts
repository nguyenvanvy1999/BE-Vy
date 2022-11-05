import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

import type { IBase } from '../interfaces';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class BaseSchema extends Document implements IBase {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  _id!: Types.ObjectId;

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}
