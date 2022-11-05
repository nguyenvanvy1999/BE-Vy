import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundError extends NotFoundException {
  constructor(schemaName: string) {
    super('error.entity-with-id-not-found', schemaName);
  }
}
