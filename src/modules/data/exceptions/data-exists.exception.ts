import { NotFoundException } from '@nestjs/common';

export class DataExistsException extends NotFoundException {
  constructor() {
    super('Data has been exists');
  }
}
