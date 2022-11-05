import { Injectable } from '@nestjs/common';
import { PermissionInvalidException } from '@src/modules/permission/exceptions';
import { DEFAULT_PERMISSIONS, EPermissions } from '@src/modules/permission/permission.constant';
import type {
  IPermissionDefinitionConfig,
  PermissionDefinition,
} from '@src/modules/permission/services/permission.definition';

@Injectable()
export class PermissionService {
  public getAllPermissionsMetadata(
    customPermissions: PermissionDefinition[],
  ): Array<Required<IPermissionDefinitionConfig>> {
    const allPermissions = [...DEFAULT_PERMISSIONS, ...customPermissions];

    return allPermissions.reduce(
      (all, def) => [...all, ...def.getMetadata()],
      [] as Array<Required<IPermissionDefinitionConfig>>,
    );
  }

  public getAllAssignablePermissions(): EPermissions[] {
    return this.getAllPermissionsMetadata([])
      .filter((p) => p.isAssignable)
      .map((p) => p.name as EPermissions);
  }

  public checkPermissionsAreValid(permissions?: EPermissions[] | null): void {
    if (!permissions) {
      return;
    }

    const allAssignablePermissions = this.getAllAssignablePermissions();

    for (const permission of permissions) {
      if (!allAssignablePermissions.includes(permission) || permission === EPermissions.SuperAdmin) {
        throw new PermissionInvalidException();
      }
    }
  }

  public getAllPermissions(): string[] {
    return Object.values(EPermissions);
  }
}
