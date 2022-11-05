import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UserRequestReqDTO {
  @IsNotEmpty()
  @IsMongoId()
  @Type(() => String)
  user: string;
}
