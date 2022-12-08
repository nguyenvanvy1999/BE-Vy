import { ApiProperty } from '@nestjs/swagger';

import type { DataDocument } from '../schemas/data.schema';

export class DataResDTO {
  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true, nullable: false })
  vehicleCode: string;

  @ApiProperty({ type: Date, required: true, nullable: false })
  timeIn: Date;

  @ApiProperty({ type: Date, required: false, nullable: true })
  timeOut: Date;

  @ApiProperty()
  imageIn: string;

  @ApiProperty()
  imageOut: string;

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
    this.timeIn = data.timeIn;
    this.timeOut = data.timeOut;
    this.imageIn = data.imageIn;
    this.imageOut = data.imageOut;
    this.fee = data.fee;
    this.timeDuration = data.timeDuration;
    this.paymentAt = data.paymentAt;
  }
}
