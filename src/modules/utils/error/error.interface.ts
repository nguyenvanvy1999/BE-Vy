import { ApiProperty } from '@nestjs/swagger';
import { IMessageOptionsProperties } from '@src/modules/message/message.interface';
import { TypeOfObj } from '@src/types';

export interface IErrors {
  readonly message: string;
  readonly property: string;
}

export interface IErrorException {
  statusCode: number;
  message: string;
  errors?: IErrors[];
  data?: TypeOfObj;
  properties?: IMessageOptionsProperties;
}

export class ErrorDTO {
  @ApiProperty({ type: String, nullable: false, description: 'Message of error', example: 'Message' })
  message: string;

  @ApiProperty({ type: String, nullable: false, description: 'Property of error', example: 'Property' })
  property: string;
}

export class ErrorExceptionDTO {
  @ApiProperty({ type: Number, nullable: false, description: 'Status code of exception', example: 400 })
  statusCode: number;

  @ApiProperty({ type: String, nullable: false, description: 'Message of exception', example: 'Message' })
  message: string;

  @ApiProperty({
    type: [ErrorDTO],
    nullable: true,
    description: 'Errors',
    isArray: true,
    example: [
      { message: '123', property: '456' },
      { message: '0123', property: '4567' },
    ],
  })
  errors?: ErrorDTO[];

  @ApiProperty({
    nullable: true,
    description: 'Data',
    additionalProperties: {
      oneOf: [{ type: 'array' }, { type: 'object' }],
    },
    examples: [{ type: 'object' }, [{ type: 'array' }, { type1: 'object' }]],
  })
  data?: TypeOfObj;

  @ApiProperty({
    nullable: true,
    description: 'Properties',
    additionalProperties: {
      oneOf: [{ type: 'array' }, { type: 'object' }],
    },
    examples: [{ type: 'object' }, [{ type: 'array' }, { type1: 'object' }]],
  })
  properties?: IMessageOptionsProperties;
}
