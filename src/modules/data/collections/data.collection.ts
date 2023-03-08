/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import type { FilterQuery, PipelineStage, UpdateQuery } from 'mongoose';
import { Model } from 'mongoose';

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
      _id: new ObjectId(),
      timeIn: new Date(),
      imageIn: image,
      imageOut: null,
      timeOut: null,
      vehicleCode: data.vehicleCode,
    });
  }

  public async updateOutData(
    data: CreateDataDTO,
    image: string,
  ): Promise<DataDocument> {
    const exist = await this.dataModel.findOne({
      vehicleCode: data.vehicleCode,
    });

    if (!exist) {
      throw new DataNotFoundException();
    }

    exist.timeOut = new Date();
    exist.imageOut = image;

    const start = dayjs(exist.timeIn);
    const end = dayjs();
    const duration = end.diff(start, 'minute');
    exist.fee = duration * 100;
    exist.timeDuration = duration;

    return await exist.save();
  }

  public async updateOne(
    filter: FilterQuery<DataDocument>,
    body: UpdateQuery<DataDocument>,
  ): Promise<DataDocument> {
    return await this.dataModel.findOneAndUpdate(filter, body, { new: true });
  }

  public async findOne(filter: FilterQuery<DataDocument>) {
    return await this.dataModel.findOne(filter);
  }

  public async updatePayment(id: ObjectId): Promise<DataDocument> {
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

  public async findOneById(id: ObjectId): Promise<DataDocument> {
    return await this.dataModel.findById(id);
  }

  public async count(filter?: FilterQuery<DataDocument>): Promise<number> {
    return await this.dataModel.countDocuments(filter);
  }

  public async exists(filter: FilterQuery<DataDocument>): Promise<boolean> {
    const exist = await this.dataModel.exists(filter);
    return !!exist;
  }

  public async getProfit(filter: FilterQuery<DataDocument>): Promise<number> {
    const res = await this.dataModel.aggregate([
      { $match: { ...filter, paymentAt: { $ne: null } } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$fee' },
          count: { $sum: 1 },
        },
      },
    ]);

    return res[0]?.totalAmount ?? 0;
  }

  public async aggregate<T>(pipes: PipelineStage[]): Promise<T[]> {
    return await this.dataModel.aggregate<T>(pipes);
  }
}
