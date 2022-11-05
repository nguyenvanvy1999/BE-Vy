import { BadRequestException } from '@nestjs/common';
import { EUserStatusCodeError } from '@src/modules/user/user.constant';

export class UserDoesNotActiveException extends BadRequestException {
  constructor() {
    super({
      statusCode: EUserStatusCodeError.USER_ACTIVE_ERROR,
      message: 'user.error.active',
    });
  }
}
