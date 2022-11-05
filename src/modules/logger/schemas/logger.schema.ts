import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@src/modules/base/schemas';
import { Types } from 'mongoose';

import { ELoggerAction, ELoggerLevel } from '../logger.constant';

@Schema({ timestamps: true, versionKey: false })
export class LoggerSchema extends BaseSchema {
  @Prop({
    required: true,
    enum: ELoggerLevel,
  })
  level: string;

  @Prop({
    required: true,
    enum: ELoggerAction,
  })
  action: string;

  @Prop({
    required: false,
  })
  user?: Types.ObjectId;

  @Prop({
    required: true,
    default: true,
  })
  anonymous: boolean;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  description: string;

  @Prop({
    required: false,
  })
  tags?: string[];
}

export const LoggerDatabaseName = 'loggers';

export const loggerModel = SchemaFactory.createForClass(LoggerSchema);

export type LoggerDocument = LoggerSchema & Document;
