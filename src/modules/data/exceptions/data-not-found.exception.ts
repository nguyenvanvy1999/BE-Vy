import { NotFoundException } from '@nestjs/common';

export class DataNotFoundException extends NotFoundException {
  constructor() {
    super('Data not found');
  }
}
