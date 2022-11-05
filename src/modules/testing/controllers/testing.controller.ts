import { Get } from '@nestjs/common';
import { HttpApiError } from '@src/modules/utils/error/error.decorator';
import { HttpControllerInit } from '@src/modules/utils/init';
import { HttpApiRequest, UserAgent } from '@src/modules/utils/request/request.decorator';
import { HttpApiResponse } from '@src/modules/utils/response/response.decorator';
import type { IResponse } from '@src/modules/utils/response/response.interface';
import { IResult } from 'ua-parser-js';

import { TestingResDTO } from '../dtos';

@HttpControllerInit('Testing APIs', 'testing')
export class TestingCommonController {
  @HttpApiRequest('Hello router', 'Testing router')
  @HttpApiResponse('test.hello', TestingResDTO)
  @HttpApiError()
  @Get('/hello')
  async hello(@UserAgent() userAgent: IResult): Promise<IResponse> {
    return { userAgent };
  }
}
