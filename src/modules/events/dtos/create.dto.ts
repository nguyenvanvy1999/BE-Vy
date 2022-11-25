import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import { EUserType } from '../../user/constants';
import { EProcessType } from '../interfaces';

export class CreateWebSocketDTO {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  userId!: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EUserType)
  userType!: EUserType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  socketId!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  deviceId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EProcessType)
  processType!: EProcessType;

  socket?: Socket;
}
