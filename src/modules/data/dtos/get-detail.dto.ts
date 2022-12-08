import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DataDetailParamDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
