import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SettingRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  @Type(() => String)
  setting: string;
}
