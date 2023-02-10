import { Body, Get, Post, Query } from '@nestjs/common';
import { HttpApiError } from '../utils/error/error.decorator';
import { HttpControllerInit } from '../utils/init';
import { HttpApiRequest } from '../utils/request/request.decorator';
import { DOOR_STATUS } from './door-status.enum';
import { DOOR } from './door.enum';
import { FirebaseRealtimeService } from './firebase-realtime.service';

@HttpControllerInit('Door controller APIs', 'door', '1')
export class DoorController {
  constructor(private readonly realtimeService: FirebaseRealtimeService) {}

  @HttpApiRequest('Control in door')
  @HttpApiError()
  @Post('control-door')
  public controlInDoor(@Body() body: { status: DOOR_STATUS; door: DOOR }): any {
    return { status: this.realtimeService.controlDoor(body), door: body.door };
  }

  @HttpApiRequest('Get door status')
  @HttpApiError()
  @Get('door-status')
  public async getDoorStatus(@Query('door') door: DOOR): Promise<any> {
    return { status: await this.realtimeService.getDoorStatus(door), door };
  }
}
