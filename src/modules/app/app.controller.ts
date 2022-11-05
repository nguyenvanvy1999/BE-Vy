import { Get } from '@nestjs/common';
import { HttpControllerInit } from '@src/modules/utils/init';
import { HttpApiRequest } from '@src/modules/utils/request/request.decorator';

import { AppService } from './app.service';

@HttpControllerInit('Default APIs', '/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @HttpApiRequest('Hello world')
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
