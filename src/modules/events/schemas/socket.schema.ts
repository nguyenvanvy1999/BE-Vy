import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Socket } from 'socket.io';
import { BaseSchema } from '../../base/schemas';
import { EUserType, EUserTypeList } from '../../user/constants';
import { ECollectionName } from '../../utils/database';
import { EProcessTypeList, EProcessType } from '../interfaces';

@Schema({ timestamps: false, versionKey: false, _id: false })
export class WebSocket extends BaseSchema {
  @Prop({
    type: ObjectId,
    required: true,
    ref: ECollectionName.USER,
  })
  userId!: ObjectId;

  @Prop({
    type: String,
    enum: EUserTypeList,
    required: true,
  })
  userType!: EUserType;

  @Prop({
    type: String,
    required: true,
  })
  socketId!: string;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  deviceId?: string;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  version?: string;

  @Prop({
    type: String,
    required: false,
    enum: EProcessTypeList,
    description: 'will be required in the future',
  })
  processType!: EProcessType;

  socket?: Socket;
}
export const WebSocketSchema = SchemaFactory.createForClass(WebSocket);
WebSocketSchema.index({
  userId: 1,
  socketId: 1,
});
WebSocketSchema.index({
  socketId: 1,
});
