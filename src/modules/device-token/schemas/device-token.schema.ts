import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@src/modules/base/schemas';
import type { Document } from 'mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';

@Schema()
export class DeviceTokenSchema extends BaseSchema {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'Device',
    immutable: true,
  })
  deviceId: Types.ObjectId;

  @Prop({ type: String, required: true, immutable: true }) token: string;

  @Prop({ type: String, required: true, immutable: true }) IPAddress: string;
}

export const deviceTokenModel = SchemaFactory.createForClass(DeviceTokenSchema);

export type DeviceTokenDocument = DeviceTokenSchema & Document;

export const deviceTokenDatabaseName = 'deviceTokens';
