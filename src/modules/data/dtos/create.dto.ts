import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDataDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  vehicleCode!: string;
}
