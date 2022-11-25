import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

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
export class Setting {
  @Prop({
    required: true,
    index: true,
    unique: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: false,
  })
  description?: string;

  @Prop({
    required: true,
    trim: true,
    type: MongooseSchema.Types.Mixed,
  })
  value: string | number | boolean;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);

export type SettingDocument = Setting & Document;
