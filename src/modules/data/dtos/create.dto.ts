import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInDataDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  vehicleCode!: string;
}
