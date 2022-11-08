import { Body, Post } from '@nestjs/common';

import { UserListReqDTO } from '../../user/dtos';
import { HttpApiError } from '../../utils/error/error.decorator';
import { HttpApiRequest } from '../../utils/request/request.decorator';
import { HttpApiResponse } from '../../utils/response/response.decorator';
import { CreateInDataDTO } from '../dtos';
import type { DataDocument } from '../schemas/data.schema';
import type { DataService } from '../services/data.service';

export class DataController {
  constructor(private readonly dataService: DataService) {}

  @HttpApiRequest('Create vehicle in')
  @HttpApiResponse('data.create', UserListReqDTO)
  @HttpApiError()
  @Post('/create')
  vehicleIn(@Body() data: CreateInDataDTO): Promise<DataDocument> {
    return this.dataService.createInData(data);
  }
}
