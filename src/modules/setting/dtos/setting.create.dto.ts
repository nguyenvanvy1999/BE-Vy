import { ApiProperty } from '@nestjs/swagger';
import {
  SafeString,
  StringOrNumberOrBoolean,
} from '@src/modules/utils/request/validation';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class SettingCreateReqDTO {
  @IsString()
  @IsNotEmpty()
  @SafeString()
  @Type(() => String)
  @ApiProperty({
    description: 'Setting name',
    example: 'settingName',
    type: String,
    required: true,
    nullable: false,
  })
  readonly name: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  @ValidateIf((e) => e.description !== '')
  @ApiProperty({
    description: 'Setting description',
    example: 'settingDescription',
    type: String,
    required: false,
    nullable: true,
  })
  readonly description?: string;

  @IsNotEmpty()
  @StringOrNumberOrBoolean()
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    examples: ['true', 10, true],
    required: true,
    nullable: false,
    description: 'value',
  })
  readonly value: string | boolean | number;
}
