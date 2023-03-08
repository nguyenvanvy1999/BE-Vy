import { ApiProperty } from '@nestjs/swagger';
import { LicencePlate } from '../licence-plate.schema';

export class LicencePlateResDto {
  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
  })
  _id: string;

  @ApiProperty()
  licencePlate: string;

  @ApiProperty()
  amount: number;

  constructor(data: LicencePlate) {
    this._id = data._id.toString();
    this.licencePlate = data.licencePlate;
    this.amount = data.amount;
  }
}
