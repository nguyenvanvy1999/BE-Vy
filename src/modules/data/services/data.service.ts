import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ObjectId } from 'mongodb';
import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { EEventType } from '../../gateway/dtos/event-type.enum';

import type { IDatabaseFindAllOptions } from '../../utils/database';
import { DataCollection } from '../collections';
import type { CreateDataDTO, GetProfitQueryDto } from '../dtos';
import { DataResDTO } from '../dtos';
import { DataNotFoundException } from '../exceptions';
import type { DataDocument } from '../schemas/data.schema';

@Injectable()
export class DataService {
  constructor(
    private readonly dataCollection: DataCollection,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async createInData(
    data: CreateDataDTO,
    image: string,
  ): Promise<DataResDTO> {
    const res = await this.dataCollection.createInData(data, image);
    const newData = new DataResDTO(res);
    this.eventEmitter.emit(EEventType.IN, newData);
    return newData;
  }

  public async updateOutData(
    data: CreateDataDTO,
    image: string,
  ): Promise<DataResDTO> {
    const res = await this.dataCollection.updateOutData(data, image);
    const newData = new DataResDTO(res);
    this.eventEmitter.emit(EEventType.OUT, newData);
    return newData;
  }

  public async getListData(
    filter?: FilterQuery<DataDocument>,
    options?: IDatabaseFindAllOptions,
  ): Promise<DataResDTO[]> {
    const data = await this.dataCollection.findAll(filter, options);

    return data.map((x) => new DataResDTO(x));
  }

  public countData(filter?: FilterQuery<DataDocument>): Promise<number> {
    return this.dataCollection.count(filter);
  }

  public async updatePayment(id: string): Promise<DataResDTO> {
    const res = await this.dataCollection.updatePayment(new Types.ObjectId(id));
    if (!res) {
      throw new DataNotFoundException();
    }
    const newData = new DataResDTO(res);
    this.eventEmitter.emit(EEventType.PAYMENT, newData);
    return newData;
  }

  public existsByCode(vehicleCode: string): Promise<boolean> {
    return this.dataCollection.exists({ vehicleCode });
  }

  public async getDetail(id: string): Promise<DataResDTO> {
    const res = await this.dataCollection.findOneById(new ObjectId(id));
    return new DataResDTO(res);
  }

  public async getProfit(query: GetProfitQueryDto): Promise<number> {
    return this.dataCollection.getProfit({
      $and: [
        { createdAt: { $gte: new Date(query.startTime) } },
        { createdAt: { $lte: new Date(query.endTime) } },
      ],
    });
  }
}
