import { NotFoundException } from '@nestjs/common';
import { EStatusCodeError } from '@src/modules/utils/error/error.constant';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super({
      statusCode: EStatusCodeError.USER_NOT_FOUND_ERROR,
      message: 'user.error.notFound',
    });
  }
}
