import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@src/modules/base/schemas';
import type { Document } from 'mongoose';

import { DeviceStatus } from '../dto';

@Schema({ versionKey: false, timestamps: true })
export class DeviceSchema extends BaseSchema {
  @Prop({ required: true, type: String })
  deviceName!: string;

  @Prop({ required: true, type: String, immutable: true })
  deviceType!: string;

  @Prop({ required: true, type: String, immutable: true })
  SN!: string;

  @Prop({ type: String, required: true, trim: true, immutable: true })
  deviceMAC!: string;

  @Prop({ type: String, required: true, trim: true })
  firmwareVersion!: string;

  @Prop({ type: String, required: false, trim: true })
  IPAddress?: string;

  @Prop({ type: Number, required: false })
  port?: number;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: String, required: true, enum: DeviceStatus, default: DeviceStatus.INACTIVE })
  status!: DeviceStatus;
}

export const deviceModel = SchemaFactory.createForClass(DeviceSchema);

export type DeviceDocument = DeviceSchema & Document;

export const deviceDatabaseName = 'devices';
