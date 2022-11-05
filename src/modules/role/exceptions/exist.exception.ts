import { BadRequestException } from '@nestjs/common';
import { ERoleStatusCodeError } from '@src/modules/role/role.constant';

export class RoleExistException extends BadRequestException {
  constructor() {
    super({
      statusCode: ERoleStatusCodeError.ROLE_EXIST_ERROR,
      message: 'role.error.exist',
    });
  }
}
