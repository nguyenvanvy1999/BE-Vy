import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';

import type { IDatabaseFindAllOptions } from '../../utils/database';
import { DataCollection } from '../collections';
import type { CreateDataDTO } from '../dtos';
import { DataResDTO } from '../dtos';
import type { DataDocument } from '../schemas/data.schema';

@Injectable()
export class DataService {
  constructor(private readonly dataCollection: DataCollection) {}

  public async createInData(
    data: CreateDataDTO,
    image: string,
  ): Promise<DataResDTO> {
    const res = await this.dataCollection.createInData(data, image);

    return new DataResDTO(res);
  }

  public async updateOutData(
    data: CreateDataDTO,
    image: string,
  ): Promise<DataResDTO> {
    const res = await this.dataCollection.updateOutInData(data, image);

    return new DataResDTO(res);
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

    return new DataResDTO(res);
  }
}
