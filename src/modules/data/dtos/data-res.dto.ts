import { ApiProperty } from '@nestjs/swagger';

import type { DataDocument, TimeAndImage } from '../schemas/data.schema';

export class TimeAndImageResDTO {
  @ApiProperty({ required: true })
  image!: string;

  @ApiProperty({ required: true })
  time!: Date;

  constructor(data: TimeAndImage) {
    if (!data) {
      return;
    }

    this.image = data.image;
    this.time = data.time;
  }
}
export class DataResDTO {
  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true, nullable: false })
  vehicleCode: string;

  @ApiProperty({ type: TimeAndImageResDTO, required: true, nullable: false })
  in: TimeAndImageResDTO;

  @ApiProperty({ type: TimeAndImageResDTO, required: false, nullable: true })
  out: TimeAndImageResDTO;

  @ApiProperty({ required: false })
  fee: number;

  @ApiProperty({ required: false })
  timeDuration: number;

  @ApiProperty({ required: false })
  paymentAt: Date;

  constructor(data: DataDocument) {
    if (!data) {
      return;
    }

    this._id = data._id.toString();
    this.vehicleCode = data.vehicleCode;
    this.in = new TimeAndImageResDTO(data.in);
    this.out = new TimeAndImageResDTO(data.out);
    this.fee = data.fee;
    this.timeDuration = data.timeDuration;
    this.paymentAt = data.paymentAt;
  }
}
