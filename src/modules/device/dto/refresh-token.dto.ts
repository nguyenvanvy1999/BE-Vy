import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeviceRefreshTokenReqDTO {
  @ApiProperty({ type: String, required: true, description: 'Token', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  @Type(() => String)
  token!: string;
}
