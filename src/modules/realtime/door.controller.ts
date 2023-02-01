import { Get, Query } from '@nestjs/common';
import { HttpApiError } from '../utils/error/error.decorator';
import { HttpControllerInit } from '../utils/init';
import { HttpApiRequest } from '../utils/request/request.decorator';
import { DOOR_STATUS } from './door-status.enum';
import { FirebaseRealtimeService } from './firebase-realtime.service';

@HttpControllerInit('Door controller APIs', 'door', '1')
export class DoorController {
  constructor(private readonly realtimeService: FirebaseRealtimeService) {}

  @HttpApiRequest('Control in door')
  @HttpApiError()
  @Get('control-in-door')
  public async controlInDoor(
    @Query('status') status: DOOR_STATUS,
  ): Promise<any> {
    return this.realtimeService.controlInDoor(status);
  }

  @HttpApiRequest('Control out door')
  @HttpApiError()
  @Get('control-out-door')
  public async controlOutDoor(
    @Query('status') status: DOOR_STATUS,
  ): Promise<any> {
    return this.realtimeService.controlOutDoor(status);
  }
}
