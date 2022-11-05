import { NotFoundException } from '@nestjs/common';
import { EUserStatusCodeError } from '@src/modules/user/user.constant';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super({
      statusCode: EUserStatusCodeError.USER_NOT_FOUND_ERROR,
      message: 'user.error.notFound',
    });
  }
}
