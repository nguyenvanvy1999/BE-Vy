import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOutDataDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  image!: string;

  @ApiProperty()
  @IsNotEmpty()
  vehicleCode!: string;
}
