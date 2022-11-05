import { PickType } from '@nestjs/swagger';
import { DeviceCreateReqDTO } from '@src/modules/device/dto/create.dto';

export class DeviceInactiveResDTO extends PickType(DeviceCreateReqDTO, ['_id'] as const) {}
