import { BadRequestException } from '@nestjs/common';
import { EUserStatusCodeError } from '@src/modules/user/user.constant';

export class UserExistException extends BadRequestException {
  constructor() {
    super({
      statusCode: EUserStatusCodeError.USER_EXISTS_ERROR,
      message: 'user.error.exist',
    });
  }
}

export class UserEmailExistException extends BadRequestException {
  constructor() {
    super({
      statusCode: EUserStatusCodeError.USER_EMAIL_EXIST_ERROR,
      message: 'user.error.emailExist',
    });
  }
}

export class UserPhoneNumberExistException extends BadRequestException {
  constructor() {
    super({
      statusCode: EUserStatusCodeError.USER_MOBILE_NUMBER_EXIST_ERROR,
      message: 'user.error.mobileNumberExist',
    });
  }
}
