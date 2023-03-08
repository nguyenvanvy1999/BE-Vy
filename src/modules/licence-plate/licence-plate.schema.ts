import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@src/modules/base/schemas';
import type { Document } from 'mongoose';

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
export class LicencePlate extends BaseSchema {
  @Prop({ type: String, required: true })
  licencePlate: string;

  @Prop({ type: Number, required: false, default: 0 })
  amount: number;
}

export const LicencePlateSchema = SchemaFactory.createForClass(LicencePlate);

export type LicencePlateDocument = LicencePlate & Document;
