import type { PipeTransform } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { isMongoId } from 'class-validator';
import mongoose from 'mongoose';

@Injectable()
export class MongoIdPipe implements PipeTransform {
  transform(value: any): mongoose.Types.ObjectId {
    if (isMongoId(value)) {
      return new mongoose.Types.ObjectId(value as string);
    }

    throw new BadRequestException('Must be an mongo id');
  }
}
