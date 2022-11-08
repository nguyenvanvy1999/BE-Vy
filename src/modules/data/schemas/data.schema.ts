import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@src/modules/base/schemas';
import type { Document } from 'mongoose';

@Schema({ timestamps: false, versionKey: false, _id: false })
export class TimeAndImage {
  @Prop({ required: true, type: String })
  image: string;

  @Prop({ required: true, type: Date })
  time: Date;
}

@Schema({ timestamps: true, versionKey: false })
export class DataSchema extends BaseSchema {
  @Prop({ required: true, trim: true, type: String })
  vehicleCode: string;

  @Prop({ type: TimeAndImage, required: true })
  in: TimeAndImage;

  @Prop({ type: TimeAndImage, default: null, required: false })
  out: TimeAndImage;

  @Prop({ type: Number, default: 0, required: false, min: 0 })
  timeDuration: number;

  @Prop({ type: Number, default: 0, required: false, min: 0 })
  fee: number;
}

export const dataDatabaseName = 'data';
export const dataModel = SchemaFactory.createForClass(DataSchema);

export type DataDocument = DataSchema & Document;
