import { CrudPermissionDefinition, PermissionDefinition } from './services/permission.definition';

export enum EPermissions {
  Authenticated = 'Authenticated',
  CreateUser = 'CreateUser',
  UpdateUser = 'UpdateUser',
  ReadUser = 'ReadUser',
  DeleteUser = 'DeleteUser',
  CreateRole = 'CreateRole',
  UpdateRole = 'UpdateRole',
  ReadRole = 'ReadRole',
  DeleteRole = 'DeleteRole',
  ReadPermission = 'ReadPermission',
  ReadSetting = 'ReadSetting',
  UpdateSetting = 'UpdateSetting',
  Public = 'Public',
  Owner = 'Owner',
  SuperAdmin = 'SuperAdmin',
}

export const DEFAULT_PERMISSIONS: PermissionDefinition[] = [
  new PermissionDefinition({
    name: 'Authenticated',
    description: 'Authenticated means simply that the user is logged in',
    isAssignable: true,
    isInternal: true,
  }),
  new PermissionDefinition({
    name: 'SuperAdmin',
    description: 'SuperAdmin has unrestricted access to all operations',
    isAssignable: true,
    isInternal: true,
  }),
  new PermissionDefinition({
    name: 'Owner',
    description: "Owner means the user owns this entity, e.g. a Customer's own Order",
    isAssignable: false,
    isInternal: true,
  }),
  new PermissionDefinition({
    name: 'Public',
    description: 'Public means any unauthenticated user may perform the operation',
    isAssignable: false,
    isInternal: true,
  }),
  new CrudPermissionDefinition('User'),
  new CrudPermissionDefinition('Permission'),
  new CrudPermissionDefinition('Role'),
  new CrudPermissionDefinition('Setting'),
];

export const PERMISSION_META_KEY = 'PermissionMetaKey';

export const PERMISSION_ACTIVE_META_KEY = 'PermissionActiveMetaKey';

export enum EPermissionStatusCodeError {
  PERMISSION_NOT_FOUND_ERROR = 5200,
  PERMISSION_GUARD_INVALID_ERROR = 5201,
  PERMISSION_ACTIVE_ERROR = 5203,
}
