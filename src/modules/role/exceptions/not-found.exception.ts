import { NotFoundException } from '@nestjs/common';
import { ERoleStatusCodeError } from '@src/modules/role/role.constant';

export class RoleNotFoundException extends NotFoundException {
  constructor() {
    super({
      statusCode: ERoleStatusCodeError.ROLE_NOT_FOUND_ERROR,
      message: 'role.error.notFound',
    });
  }
}

export class UserRoleNotFoundException extends NotFoundException {
  constructor() {
    super({
      statusCode: ERoleStatusCodeError.ROLE_USER_NOT_FOUND,
      message: 'role.error.userRoleNotFound',
    });
  }
}

export class SuperAdminRoleNotFoundException extends NotFoundException {
  constructor() {
    super({
      statusCode: ERoleStatusCodeError.ROLE_SUPER_ADMIN_NOT_FOUND,
      message: 'role.error.superAdminRoleNotFound',
    });
  }
}
