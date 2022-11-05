import type { EPermissions } from '@src/modules/permission/permission.constant';

export interface IPermissionDefinitionConfig {
  name: string;
  description?: string;
  isAssignable?: boolean;
  isInternal?: boolean;
}

export type PermissionMetadata = Required<IPermissionDefinitionConfig>;
export class PermissionDefinition {
  constructor(protected config: IPermissionDefinitionConfig) {}

  getMetadata(): PermissionMetadata[] {
    const { name, description, isAssignable, isInternal } = this.config;

    return [
      {
        name,
        description: description || `Grants permissions on ${name} operations`,
        isAssignable: isAssignable ?? true,
        isInternal: isInternal ?? false,
      },
    ];
  }

  get Permission(): EPermissions {
    return this.config.name as EPermissions;
  }
}

export class CrudPermissionDefinition extends PermissionDefinition {
  constructor(name: string, private descriptionFn?: (operation: 'create' | 'read' | 'update' | 'delete') => string) {
    super({ name });
  }

  getMetadata(): PermissionMetadata[] {
    return ['Create', 'Read', 'Update', 'Delete'].map((operation) => ({
      name: `${operation}${this.config.name}`,
      description:
        typeof this.descriptionFn === 'function'
          ? this.descriptionFn(operation.toLocaleLowerCase() as any)
          : `Grants permission to ${operation.toLocaleLowerCase()} ${this.config.name}`,
      isAssignable: true,
      isInternal: false,
    }));
  }

  get Create(): EPermissions {
    return `Create${this.config.name}` as EPermissions;
  }

  get Read(): EPermissions {
    return `Read${this.config.name}` as EPermissions;
  }

  get Update(): EPermissions {
    return `Update${this.config.name}` as EPermissions;
  }

  get Delete(): EPermissions {
    return `Delete${this.config.name}` as EPermissions;
  }
}
