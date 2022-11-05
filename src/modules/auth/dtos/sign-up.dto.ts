import { ApiProperty } from '@nestjs/swagger';
import { IsPasswordStrong, IsStartWith } from '@src/modules/utils/request/validation';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class AuthSignUpDTO {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @Type(() => String)
  @ApiProperty({
    description: 'Email',
    type: String,
    required: true,
    nullable: false,
    format: 'email',
    example: 'email@example.com',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  @ApiProperty({
    description: 'FirstName',
    type: String,
    required: true,
    nullable: false,
    example: 'firstName',
  })
  readonly firstName: string;

  @IsString()
  @IsOptional()
  @ValidateIf((e) => e.lastName !== '')
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  @ApiProperty({
    description: 'LastName',
    type: String,
    required: false,
    nullable: false,
    example: 'lastName',
  })
  readonly lastName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  @Type(() => String)
  @IsStartWith(['84'])
  @ApiProperty({
    description: 'mobileNumber',
    type: String,
    nullable: false,
    required: true,
    format: 'phone',
    example: '84123456789',
    minLength: 10,
    maxLength: 14,
  })
  readonly mobileNumber: string;

  @IsNotEmpty()
  @IsPasswordStrong()
  @ApiProperty({
    description: 'password',
    type: String,
    nullable: false,
    required: true,
  })
  readonly password: string;
}
