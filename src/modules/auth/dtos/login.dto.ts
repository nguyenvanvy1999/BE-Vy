import { PickType } from '@nestjs/swagger';
import { AuthSignUpDTO } from '@src/modules/auth/dtos/sign-up.dto';
import { IsBoolean, IsOptional, ValidateIf } from 'class-validator';

export class AuthLoginDTO extends PickType(AuthSignUpDTO, ['email', 'password'] as const) {
  @IsOptional()
  @IsBoolean()
  @ValidateIf((e) => e.rememberMe !== '')
  readonly rememberMe?: boolean;
}
