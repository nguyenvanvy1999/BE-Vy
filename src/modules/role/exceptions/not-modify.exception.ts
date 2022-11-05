import { ForbiddenException } from '@nestjs/common';
import { ERoleStatusCodeError } from '@src/modules/role/role.constant';

export class RoleCanNotModifyException extends ForbiddenException {
  constructor() {
    super({
      statusCode: ERoleStatusCodeError.CAN_NOT_MODIFY_ROLE,
      message: 'role.error.canNotModifyRole',
    });
  }
}
