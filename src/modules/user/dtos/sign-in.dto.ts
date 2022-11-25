import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInBodyTO {
  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
