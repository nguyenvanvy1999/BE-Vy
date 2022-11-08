import { BadRequestException } from '@nestjs/common';

export class FileNotAcceptedException extends BadRequestException {
  constructor() {
    super('File not accepted!');
  }
}
