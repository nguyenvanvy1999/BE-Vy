import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class EditLicencePlateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
