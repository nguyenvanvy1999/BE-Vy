import { InternalServerErrorException } from '@nestjs/common';
import { EStatusCodeError } from '@src/modules/utils/error/error.constant';

export class CreateFirebaseAccountException extends InternalServerErrorException {
  constructor() {
    super({
      statusCode: EStatusCodeError.USER_CREATE_FIREBASE_ACCOUNT_ERROR,
      message: 'user.error.createFirebaseAccountWrong',
    });
  }
}
