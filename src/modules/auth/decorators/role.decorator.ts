import { SetMetadata } from '@nestjs/common';
import { EUserType } from '../../user/constants';

export const Roles = (...roles: EUserType[]) => SetMetadata('roles', roles);
