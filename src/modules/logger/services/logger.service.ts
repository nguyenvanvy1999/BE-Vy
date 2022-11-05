import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ELoggerLevel } from '../logger.constant';
import type { ILogger } from '../logger.interface';
import type { LoggerDocument } from '../schemas/logger.schema';
import { LoggerSchema } from '../schemas/logger.schema';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel(LoggerSchema.name)
    private readonly loggerModel: Model<LoggerDocument>,
  ) {}

  async info({ action, description, apiKey, user, tags }: ILogger): Promise<LoggerDocument> {
    const create = new this.loggerModel({
      level: ELoggerLevel.INFO,
      user: new Types.ObjectId(user),
      apiKey: new Types.ObjectId(apiKey),
      anonymous: Boolean(user),
      action,
      description,
      tags,
    });

    return create.save();
  }

  async debug({ action, description, apiKey, user, tags }: ILogger): Promise<LoggerDocument> {
    const create = new this.loggerModel({
      level: ELoggerLevel.DEBUG,
      user: new Types.ObjectId(user),
      apiKey: new Types.ObjectId(apiKey),
      anonymous: Boolean(user),
      action,
      description,
      tags,
    });

    return create.save();
  }

  async warning({ action, description, apiKey, user, tags }: ILogger): Promise<LoggerDocument> {
    const create = new this.loggerModel({
      level: ELoggerLevel.WARM,
      user: new Types.ObjectId(user),
      apiKey: new Types.ObjectId(apiKey),
      anonymous: Boolean(user),
      action,
      description,
      tags,
    });

    return create.save();
  }

  async fatal({ action, description, apiKey, user, tags }: ILogger): Promise<LoggerDocument> {
    const create = new this.loggerModel({
      level: ELoggerLevel.FATAL,
      user: new Types.ObjectId(user),
      apiKey: new Types.ObjectId(apiKey),
      anonymous: Boolean(user),
      action,
      description,
      tags,
    });

    return create.save();
  }
}
