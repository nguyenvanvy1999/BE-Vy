import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from '../../utils/request/validation';
import { EUserType, EUserTypeList } from '../constants';

export class SignUpBodyDTO {
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
  firstName: string;

  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    enum: EUserTypeList,
    enumName: 'EUserType',
  })
  @IsNotEmpty()
  @IsEnum(EUserType)
  userType: EUserType;

  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('password')
  passwordConfirm: string;
}
