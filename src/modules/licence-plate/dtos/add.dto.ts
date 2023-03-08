import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddLicencePlateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  licencePlate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
