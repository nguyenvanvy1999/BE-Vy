import { NotFoundException } from '@nestjs/common';
import { ERoleStatusCodeError } from '@src/modules/role/role.constant';

export class SettingNotFoundException extends NotFoundException {
  constructor() {
    super({
      statusCode: ERoleStatusCodeError.ROLE_NOT_FOUND_ERROR,
      message: 'setting.error.notFound',
    });
  }
}
