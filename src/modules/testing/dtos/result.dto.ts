import { ApiProperty } from '@nestjs/swagger';
import { IBrowser, ICPU, IDevice, IEngine, IOS } from 'ua-parser-js';

export class TestingResDTO {
  @ApiProperty({ description: 'UA', type: String, nullable: false })
  ua: string;

  @ApiProperty()
  browser: IBrowser;

  @ApiProperty()
  device: IDevice;

  @ApiProperty()
  engine: IEngine;

  @ApiProperty()
  os: IOS;

  @ApiProperty()
  cpu: ICPU;
}
