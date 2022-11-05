import { ApiProperty, PickType } from '@nestjs/swagger';
import { SettingResDTO } from '@src/modules/setting/dtos/setting.dto';
import { StringOrNumberOrBoolean } from '@src/modules/utils/request/validation';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class SettingUpdateReqDTO {
  @IsString()
  @IsOptional()
  @Type(() => String)
  @ValidateIf((e) => e.description !== '')
  @ApiProperty({ type: String, description: 'description', nullable: true, required: false, example: 'description' })
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

export class SettingUpdateResDTO extends PickType(SettingResDTO, ['_id'] as const) {}
