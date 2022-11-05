import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SettingResDTO {
  @Type(() => String)
  @ApiProperty({ type: String, description: '_id', nullable: false })
  readonly _id: string;

  @ApiProperty({ type: String, description: 'name', nullable: false })
  readonly name: string;

  @ApiProperty({ type: String, description: 'description', nullable: true })
  readonly description?: string;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    examples: ['true', 10, true],
    required: true,
    nullable: false,
    description: 'value',
  })
  readonly value: string | number | boolean;

  @ApiProperty({ type: Date, description: 'createdAt', nullable: false })
  readonly createdAt: Date;

  @ApiProperty({ type: Date, description: 'updatedAt', nullable: false })
  readonly updatedAt: Date;
}
