import { ApiProperty } from '@nestjs/swagger';
import { IsPasswordStrong, IsStartWith } from '@src/modules/utils/request/validation';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UserCreateReqDTO {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @Type(() => String)
  @ApiProperty({
    description: 'Email',
    type: String,
    nullable: false,
    required: true,
    format: 'email',
    example: 'email@example.com',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  @ApiProperty({ description: 'firstName', type: String, nullable: false, required: true })
  readonly firstName: string;

  @IsString()
  @IsOptional()
  @ValidateIf((e) => e.lastName !== '')
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  @ApiProperty({ description: 'lastName', type: String, nullable: true, required: false })
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
  @IsArray()
  @IsMongoId({ each: true })
  @ApiProperty({
    description: 'Roles',
    type: [String],
    example: ['6293775969054d06c02c545a', '62937762ef60e632003ecc59'],
  })
  readonly roles: string[];

  @IsNotEmpty()
  @IsPasswordStrong()
  @ApiProperty({ description: 'password', type: String, nullable: false, required: true })
  readonly password: string;
}
