import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class SettingSchema {
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

export const settingDatabaseName = 'settings';

export const settingModel = SchemaFactory.createForClass(SettingSchema);

export type SettingDocument = SettingSchema & Document;
