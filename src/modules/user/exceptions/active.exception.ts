import { BadRequestException } from '@nestjs/common';
import { EStatusCodeError } from '@src/modules/utils/error/error.constant';

export class UserDoesNotActiveException extends BadRequestException {
  constructor() {
    super({
      statusCode: EStatusCodeError.USER_ACTIVE_ERROR,
      message: 'user.error.active',
    });
  }
}
