import { BadRequestException } from '@nestjs/common';
import { EStatusCodeError } from '@src/modules/utils/error/error.constant';

export class UserExistException extends BadRequestException {
  constructor() {
    super({
      statusCode: EStatusCodeError.USER_EXISTS_ERROR,
      message: 'user.error.exist',
    });
  }
}

export class UserEmailExistException extends BadRequestException {
  constructor() {
    super({
      statusCode: EStatusCodeError.USER_EMAIL_ALREADY_EXIST_ERROR,
      message: 'user.error.emailExist',
    });
  }
}
