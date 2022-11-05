export const ROLE_DEFAULT_SORT = 'name@asc';
export const ROLE_DEFAULT_PAGE = 1;
export const ROLE_DEFAULT_PER_PAGE = 10;
export const ROLE_DEFAULT_AVAILABLE_SORT = ['name', 'createdAt'];
export const ROLE_DEFAULT_AVAILABLE_SEARCH = ['name'];

export enum ERoleStatusCodeError {
  ROLE_IS_INACTIVE_ERROR = 5500,
  ROLE_NOT_FOUND_ERROR = 5501,
  ROLE_EXIST_ERROR = 5502,
  ROLE_ACTIVE_ERROR = 5503,
  ROLE_USED_ERROR = 5504,
  ROLE_SUPER_ADMIN_NOT_FOUND = 5505,
  ROLE_USER_NOT_FOUND = 5506,
  CAN_NOT_MODIFY_ROLE = 5507,
}

export const ROLE_ACTIVE_META_KEY = 'RoleActiveMetaKey';

export const SUPER_ADMIN_ROLE_CODE = '__super_admin_role__';
export const USER_ROLE_CODE = '__user_role__';
export const SUPER_ADMIN_ROLE_DESCRIPTION = 'SuperAdmin';
export const SUPER_ADMIN_USER_IDENTIFIER = 'superadmin';
export const SUPER_ADMIN_USER_PASSWORD = 'superadmin';
