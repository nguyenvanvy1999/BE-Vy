import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DebuggerService } from '@src/modules/debugger/services/debugger.service';
import { EPermissions } from '@src/modules/permission/permission.constant';
import { PermissionService } from '@src/modules/permission/services';
import type { PermissionMapDTO, RoleCreateReqDTO, RoleDetailResDTO, RoleUpdateReqDTO } from '@src/modules/role/dtos';
import { RoleResDTO } from '@src/modules/role/dtos';
import {
  RoleCanNotModifyException,
  RoleNotFoundException,
  SuperAdminRoleNotFoundException,
  UserRoleNotFoundException,
} from '@src/modules/role/exceptions';
import { SUPER_ADMIN_ROLE_CODE, USER_ROLE_CODE } from '@src/modules/role/role.constant';
import type { IDatabaseFindAllOptions } from '@src/modules/utils/database';
import { HelperObjectService } from '@src/modules/utils/helper/service/helper.object.service';
import { plainToInstance } from 'class-transformer';
import { ObjectId } from 'mongodb';
import type { FilterQuery } from 'mongoose';
import { Model } from 'mongoose';

import type { RoleDocument } from '../schemas/role.schema';
import { RoleSchema } from '../schemas/role.schema';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectModel(RoleSchema.name) private readonly roleModel: Model<RoleDocument>,
    private readonly debuggerService: DebuggerService,
    private readonly helperObjectService: HelperObjectService,
    private readonly permissionService: PermissionService,
  ) {}

  async onModuleInit(): Promise<void> {
    // const pr1 = this.ensureUserRoleExists();
    // const pr2 = this.ensureSuperAdminRoleExists();
    // await Promise.all([pr1, pr2]);
    // await this.ensureRolesHaveValidPermissions();
  }

  public async create(data: RoleCreateReqDTO): Promise<RoleDocument> {
    this.permissionService.checkPermissionsAreValid(data.permissions);

    return this.roleModel.create({
      _id: new ObjectId(),
      name: data.name,
      code: data.code,
      permissions: this.helperObjectService.unique<EPermissions>([EPermissions.Authenticated, ...data.permissions]),
    });
  }

  public async findAll(find?: Record<string, any>, options?: IDatabaseFindAllOptions): Promise<RoleDocument[]> {
    const roles = this.roleModel.find(find);

    if (options && options.limit !== undefined && options.skip !== undefined) {
      void roles.limit(options.limit).skip(options.skip);
    }

    if (options && options.sort) {
      void roles.sort(options.sort);
    }

    return roles.lean();
  }

  public async getTotal(find?: FilterQuery<RoleDocument>): Promise<number> {
    return this.roleModel.countDocuments(find);
  }

  public async findOneById(_id: string): Promise<RoleDocument> {
    return this.roleModel.findById(_id).lean();
  }

  public async getRoleDetail(_id: string): Promise<RoleDetailResDTO> {
    const role = await this.roleModel.findById(_id);
    const allPermissions = this.permissionService.getAllAssignablePermissions();
    const mappedPermissions = allPermissions.map((x) => ({ permission: x, isActive: role.permissions.includes(x) }));

    return {
      name: role.name,
      mappedPermissions,
      code: role.code,
      isActive: role.isActive,
      _id: role.id,
      createdAt: role.createdAt,
    };
  }

  public mapPermissions(permissions: EPermissions[]): PermissionMapDTO[] {
    const uniquePermissions = this.helperObjectService.unique<EPermissions>(permissions);
    const allPermissions = this.permissionService.getAllAssignablePermissions();

    return allPermissions.map((x) => ({ permission: x, isActive: uniquePermissions.includes(x) }));
  }

  public async checkRolesAreValid(ids: string[]): Promise<boolean> {
    const roles = await this.roleModel.countDocuments({ _id: { $in: ids } }).lean();

    return ids.length === roles;
  }

  public async findOne(find?: FilterQuery<RoleDocument>): Promise<RoleDocument> {
    return this.roleModel.findOne(find).lean();
  }

  public async exists(find: FilterQuery<RoleDocument>): Promise<boolean> {
    const exist = await this.roleModel.exists(find);

    return Boolean(exist);
  }

  public async getSuperAdminRole(): Promise<RoleDocument> {
    const role = await this.roleModel.findOne({ code: SUPER_ADMIN_ROLE_CODE });

    if (!role) {
      this.debuggerService.error('SuperAdmin role not found', 'RoleService', 'getSuperAdminRole');

      throw new SuperAdminRoleNotFoundException();
    }

    return role;
  }

  public async getUserRole(): Promise<RoleDocument> {
    const role = await this.roleModel.findOne({ code: USER_ROLE_CODE });

    if (!role) {
      this.debuggerService.error('User role not found', 'RoleService', 'getUserRole');

      throw new UserRoleNotFoundException();
    }

    return role;
  }

  public async update(_id: string, data: RoleUpdateReqDTO): Promise<RoleDocument> {
    this.permissionService.checkPermissionsAreValid(data.permissions);
    const role = await this.findRoleAndFilterRole(_id);
    role.code = data.code;
    role.permissions = data.permissions
      ? this.helperObjectService.unique<EPermissions>([EPermissions.Authenticated, ...data.permissions])
      : [];

    await role.save();

    return role;
  }

  public async findRoleAndFilterRole(_id: string): Promise<RoleDocument> {
    const role = await this.roleModel.findById(_id);

    if (!role) {
      throw new RoleNotFoundException();
    }

    if (role.code === SUPER_ADMIN_ROLE_CODE || role.code === USER_ROLE_CODE) {
      throw new RoleCanNotModifyException();
    }

    return role;
  }

  public async inactive(_id: string): Promise<RoleDocument> {
    const role = await this.findRoleAndFilterRole(_id);

    role.isActive = false;

    await role.save();

    return role;
  }

  public async active(_id: string): Promise<RoleDocument> {
    const role = await this.findRoleAndFilterRole(_id);

    role.isActive = true;

    await role.save();

    return role;
  }

  public async deleteOneById(_id: string): Promise<RoleDocument> {
    const role = await this.findRoleAndFilterRole(_id);

    return this.roleModel.findByIdAndDelete(role._id);
  }

  public serializationGet(data: RoleDocument): RoleResDTO {
    return plainToInstance(RoleResDTO, data);
  }

  public serializationList(data: RoleDocument[]): RoleResDTO[] {
    return plainToInstance(RoleResDTO, data);
  }

  private async ensureSuperAdminRoleExists(): Promise<void> {
    const assignablePermissions = this.permissionService.getAllAssignablePermissions();

    try {
      const superAdminRole = await this.getSuperAdminRole();
      superAdminRole.permissions = assignablePermissions;
      await superAdminRole.save();
    } catch {
      await this.create({ name: 'SuperAdmin', code: SUPER_ADMIN_ROLE_CODE, permissions: assignablePermissions });
    }
  }

  private async ensureRolesHaveValidPermissions(): Promise<void> {
    const roles = await this.roleModel.find();
    const assignablePermissions = this.permissionService.getAllAssignablePermissions();
    await Promise.all(
      roles.map(async (role) => {
        const invalidPermissions = role.permissions.filter((p) => !assignablePermissions.includes(p));

        if (invalidPermissions.length > 0) {
          role.permissions = role.permissions.filter((p) => assignablePermissions.includes(p));
          await role.save();
        }
      }),
    );
  }

  private async ensureUserRoleExists(): Promise<void> {
    try {
      const role = await this.getUserRole();
      role.permissions = [EPermissions.Authenticated];
      await role.save();
    } catch {
      await this.create({
        code: USER_ROLE_CODE,
        name: 'User',
        permissions: [EPermissions.Authenticated],
      });
    }
  }
}
