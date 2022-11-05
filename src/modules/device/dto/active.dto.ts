import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMACAddress, IsNotEmpty, IsString } from 'class-validator';

export class DeviceActiveReqDTO {
  @ApiProperty({ type: String, required: true, example: '900JP-YHVGX-9IA84-GEUJQ-UR0BC' })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  SN!: string;

  @ApiProperty({ type: String, required: true, example: 'f8:f9:7a:c5:ea:d7' })
  @IsMACAddress()
  @IsNotEmpty()
  @Type(() => String)
  deviceMAC!: string;
}

export class DeviceActiveResDTO {
  @ApiProperty({
    type: String,
    description: 'Refresh token',
    example: '24ed775f-7a82-44ac-b8fa-53ca659d9444',
    required: true,
    format: 'uuid',
  })
  readonly refreshToken!: string;

  @ApiProperty({ type: String, description: 'Access token', required: true, format: 'JWT' })
  readonly accessToken!: string;
}
