import { IsMongoId, IsNotEmpty } from 'class-validator';

export class PaymentBodyDTO {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
