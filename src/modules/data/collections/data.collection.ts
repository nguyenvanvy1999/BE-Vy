import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import type { CreateInDataDTO } from '../dtos';
import type { DataDocument } from '../schemas/data.schema';
import { DataSchema } from '../schemas/data.schema';

@Injectable()
export class DataCollection {
  constructor(@InjectModel(DataSchema.name) private readonly dataModel: Model<DataDocument>) {}

  public createInData(data: CreateInDataDTO): Promise<DataDocument> {
    return this.dataModel.create({
      _id: new Types.ObjectId(),
      in: {
        image: data.image,
      },
      vehicleCode: data.vehicleCode,
    });
  }
}
