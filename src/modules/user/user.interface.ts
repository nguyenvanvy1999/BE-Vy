import type { IRoleDocument } from '@src/modules/role/role.interface';

import type { UserDocument } from './schemas/user.schema';

export interface IUserDocument extends Omit<UserDocument, 'roles'> {
  roles: IRoleDocument[];
}

export interface IUserCreate {
  firstName: string;
  lastName?: string;
  password: string;
  passwordExpired: Date;
  email: string;
  mobileNumber: string;
  roles: string[];
  salt: string;
}

export type IUserUpdate = Pick<IUserCreate, 'firstName' | 'lastName'>;

export interface IUserCheckExist {
  email: boolean;
  mobileNumber: boolean;
}

export interface IAuthPassword {
  salt: string;
  passwordHash: string;
  passwordExpired: Date;
}
