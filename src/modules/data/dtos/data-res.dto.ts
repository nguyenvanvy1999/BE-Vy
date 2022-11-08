import { ApiProperty } from '@nestjs/swagger';

export class ImageResDTO {
  @ApiProperty({ required: true })
  image!: string;

  @ApiProperty({ required: true })
  time!: Date;
}
export class DataResDTO {}
