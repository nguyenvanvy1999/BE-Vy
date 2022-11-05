import type { RoleDocument } from './schemas/role.schema';

export type IRoleDocument = Omit<RoleDocument, 'permissions'>;
