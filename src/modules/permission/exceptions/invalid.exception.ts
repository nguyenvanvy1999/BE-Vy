import { BadRequestException } from '@nestjs/common';
import { EPermissionStatusCodeError } from '@src/modules/permission/permission.constant';

export class PermissionInvalidException extends BadRequestException {
  constructor() {
    super({
      statusCode: EPermissionStatusCodeError.PERMISSION_GUARD_INVALID_ERROR,
      message: 'permission.error.forbidden',
    });
  }
}
