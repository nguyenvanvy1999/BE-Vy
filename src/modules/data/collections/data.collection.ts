/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import type { FilterQuery } from 'mongoose';
import { Model, Types } from 'mongoose';

import type { IDatabaseFindAllOptions } from '../../utils/database';
import type { CreateDataDTO } from '../dtos';
import { DataNotFoundException } from '../exceptions';
import type { DataDocument } from '../schemas/data.schema';
import { DataSchema } from '../schemas/data.schema';

@Injectable()
export class DataCollection {
  constructor(
    @InjectModel(DataSchema.name)
    private readonly dataModel: Model<DataDocument>,
  ) {}

  public createInData(
    data: CreateDataDTO,
    image: string,
  ): Promise<DataDocument> {
    return this.dataModel.create({
      _id: new Types.ObjectId(),
      in: {
        image,
        time: new Date(),
      },
      out: null,
      vehicleCode: data.vehicleCode,
    });
  }

  public async updateOutInData(
    data: CreateDataDTO,
    image: string,
  ): Promise<DataDocument> {
    const exist = await this.dataModel.findOne({
      vehicleCode: data.vehicleCode,
    });

    if (!exist) {
      throw new DataNotFoundException();
    }

    exist.out = {
      image,
      time: new Date(),
    };

    const start = dayjs(exist.in.time);
    const end = dayjs();
    const duration = end.diff(start, 'minute');
    exist.fee = duration * 100;
    exist.timeDuration = duration;

    return await exist.save();
  }

  public async updatePayment(id: Types.ObjectId): Promise<DataDocument> {
    return await this.dataModel.findByIdAndUpdate(
      id,
      { $set: { paymentAt: new Date() } },
      { new: true },
    );
  }

  public async findAll(
    filter?: FilterQuery<DataDocument>,
    options?: IDatabaseFindAllOptions,
  ): Promise<DataDocument[]> {
    const data = this.dataModel.find(filter);

    if (options && options.limit !== undefined && options.skip !== undefined) {
      data.limit(options.limit).skip(options.skip);
    }

    if (options && options.sort) {
      data.sort(options.sort);
    }

    return data.lean();
  }

  public async count(filter?: FilterQuery<DataDocument>): Promise<number> {
    return await this.dataModel.countDocuments(filter);
  }

  public async exists(filter: FilterQuery<DataDocument>): Promise<boolean> {
    const exist = await this.dataModel.exists(filter);
    return !!exist;
  }
}
