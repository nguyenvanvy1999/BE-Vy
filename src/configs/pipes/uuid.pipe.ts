import type { PipeTransform } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class UUIDPipe implements PipeTransform {
  transform(value: any): any {
    if (isUUID(value)) {
      return value;
    }

    throw new BadRequestException('Must be an uuid id');
  }
}
