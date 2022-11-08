import { Injectable } from '@nestjs/common';

import { DataCollection } from '../collections';
import type { CreateInDataDTO } from '../dtos';
import type { DataDocument } from '../schemas/data.schema';

@Injectable()
export class DataService {
  constructor(private readonly dataCollection: DataCollection) {}

  public createInData(data: CreateInDataDTO): Promise<DataDocument> {
    return this.dataCollection.createInData(data);
  }
}
