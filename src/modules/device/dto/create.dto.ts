import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus } from '@src/modules/device/dto/status.enum';
import type { Types } from 'mongoose';

export class DeviceCreateReqDTO {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Device id',
    example: '627cf8307455287f84bee67f',
    format: 'ObjectId',
  })
  _id!: string | Types.ObjectId;

  @ApiProperty({ type: String, required: true, description: 'Device name', example: 'Camera01' })
  deviceName!: string;

  @ApiProperty({ type: String, required: true, description: 'Device type', example: 'Camera' })
  deviceType!: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Device serial number',
    example: '900JP-YHVGX-9IA84-GEUJQ-UR0BC',
  })
  SN!: string;

  @ApiProperty({ type: String, required: true, description: 'Device MAC', example: 'f8:f9:7a:c5:ea:d7' })
  deviceMAC!: string;

  @ApiProperty({ type: String, required: true, description: 'Device firmware version', example: '1.1.0' })
  firmwareVersion!: string;

  @ApiProperty({ type: String, required: false, description: 'Device IP address', example: '168.143.181.178' })
  IPAddress?: string;

  @ApiProperty({ type: Number, required: false, description: 'Device port', example: 3001 })
  port?: number;

  @ApiProperty({ type: String, required: false, description: 'Device description', example: 'Description' })
  description?: string;

  @ApiProperty({
    type: String,
    enum: DeviceStatus,
    enumName: 'DeviceStatus',
    required: true,
    default: DeviceStatus.INACTIVE,
  })
  status!: DeviceStatus;
}
