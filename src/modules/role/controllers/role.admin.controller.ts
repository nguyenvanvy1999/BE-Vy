import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  BadRequestException,
  Body,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DebuggerService } from '@src/modules/debugger/services/debugger.service';
import { PermissionInvalidException } from '@src/modules/permission/exceptions';
import { EPermissions } from '@src/modules/permission/permission.constant';
import { RoleCanNotModifyException, RoleExistException, RoleNotFoundException } from '@src/modules/role/exceptions';
import { EStatusCodeError } from '@src/modules/utils/error/error.constant';
import { HttpApiError } from '@src/modules/utils/error/error.decorator';
import { HttpControllerInit } from '@src/modules/utils/init';
import { PaginationService } from '@src/modules/utils/pagination/service/pagination.service';
import { ParamMongoId } from '@src/modules/utils/pipes';
import { HttpApiRequest } from '@src/modules/utils/request/request.decorator';
import { HttpApiResponse, HttpApiResponsePaging } from '@src/modules/utils/response/response.decorator';
import type { IResponse, IResponsePaging } from '@src/modules/utils/response/response.interface';

import {
  RoleCreateReqDTO,
  RoleDetailResDTO,
  RoleIdResDTO,
  RoleListResDTO,
  RoleResDTO,
  RoleUpdateReqDTO,
} from '../dtos';
import { ERoleStatusCodeError } from '../role.constant';
import type { RoleDocument } from '../schemas/role.schema';
import { RoleService } from '../services/role.service';

@HttpControllerInit('Role Admin APIs', 'role', '1')
export class RoleAdminController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly paginationService: PaginationService,
    private readonly roleService: RoleService,
  ) {}

  @HttpApiRequest('Get list role', 'List role with pagination and search, sort')
  @HttpApiResponsePaging('role.list', RoleResDTO)
  @HttpApiError()
  @Get('/list')
  public async list(
    @Query()
    { page, perPage, sort, search, availableSort, availableSearch }: RoleListResDTO,
  ): Promise<IResponsePaging> {
    const skip: number = this.paginationService.skip(page, perPage);
    const find: Record<string, any> = {};

    if (search) {
      find.$or = [
        {
          name: {
            $regex: new RegExp(search),
            $options: 'i',
          },
        },
      ];
    }

    const roles: RoleDocument[] = await this.roleService.findAll(find, {
      skip,
      limit: perPage,
      sort,
    });

    const totalData: number = await this.roleService.getTotal({});
    const totalPage: number = this.paginationService.totalPage(totalData, perPage);

    const data: RoleResDTO[] = this.roleService.serializationList(roles);

    return {
      totalData,
      totalPage,
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      data,
    };
  }

  @HttpApiRequest('Get role', 'Get role detail by id')
  @HttpApiResponse('role.get', RoleDetailResDTO)
  @HttpApiError([ApiException(() => RoleNotFoundException, { description: 'Role not found' })])
  @Get('get/:role')
  public get(@ParamMongoId('role') _id: string): Promise<IResponse> {
    return this.roleService.getRoleDetail(_id);
  }

  @HttpApiResponse('role.create', RoleIdResDTO)
  @HttpApiRequest('Role create')
  @HttpApiError([
    ApiException(() => RoleExistException, { description: 'Role exist' }),
    ApiException(() => PermissionInvalidException, { description: 'Permission invalid' }),
  ])
  @Post('/create')
  public async create(
    @Body()
    { name, permissions, code }: RoleCreateReqDTO,
  ): Promise<IResponse> {
    const exist: boolean = await this.roleService.exists({
      $or: [
        {
          name: {
            $regex: new RegExp(name),
            $options: 'i',
          },
        },
        { code },
      ],
    });

    if (exist) {
      this.debuggerService.error('Role Error', 'RoleAdminController', 'create');

      throw new BadRequestException({
        statusCode: ERoleStatusCodeError.ROLE_EXIST_ERROR,
        message: 'role.error.exist',
      });
    }

    try {
      const role = await this.roleService.create({
        name,
        permissions: permissions.filter((x) => x !== EPermissions.SuperAdmin),
        code,
      });

      return { _id: role.id };
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      } else {
        this.debuggerService.error('create try catch', 'RoleAdminController', 'create', error);

        throw new InternalServerErrorException({
          statusCode: EStatusCodeError.UNKNOWN_ERROR,
          message: 'http.serverError.internalServerError',
        });
      }
    }
  }

  @HttpApiResponse('role.update', RoleIdResDTO)
  @HttpApiRequest('Update role')
  @HttpApiError([
    ApiException(() => RoleExistException, { description: 'Role exist' }),
    ApiException(() => RoleNotFoundException, { description: 'Role not found' }),
    ApiException(() => RoleCanNotModifyException, { description: 'Role can not modify' }),
    ApiException(() => PermissionInvalidException, { description: 'Permission invalid' }),
  ])
  @Put('/update/:role')
  public async update(
    @ParamMongoId('role') _id: string,
    @Body()
    { name, permissions, code }: RoleUpdateReqDTO,
  ): Promise<IResponse> {
    const check: boolean = await this.roleService.exists({
      $and: [
        { _id: { $ne: _id } },
        {
          $or: [
            {
              name: {
                $regex: new RegExp(name),
                $options: 'i',
              },
            },
            { code },
          ],
        },
      ],
    });

    if (check) {
      this.debuggerService.error('Role Exist Error', 'RoleAdminController', 'update');

      throw new RoleExistException();
    }

    try {
      await this.roleService.update(_id, {
        name,
        permissions,
        code,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      } else {
        this.debuggerService.error('Role update server internal error', 'RoleController', 'update', error);

        throw new InternalServerErrorException({
          statusCode: EStatusCodeError.UNKNOWN_ERROR,
          message: 'http.serverError.internalServerError',
        });
      }
    }

    return { _id: String(_id) };
  }

  @HttpApiResponse('role.delete', RoleIdResDTO)
  @HttpApiRequest('Delete role')
  @HttpApiError([
    ApiException(() => RoleNotFoundException, { description: 'Role not found' }),
    ApiException(() => RoleCanNotModifyException, { description: 'Role can not modify' }),
  ])
  @Delete('/delete/:role')
  public async delete(@ParamMongoId('role') _id: string): Promise<IResponse> {
    try {
      await this.roleService.deleteOneById(_id);

      return { _id: String(_id) };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      } else {
        this.debuggerService.error('Role delete server internal error', 'RoleController', 'delete', error);

        throw new InternalServerErrorException({
          statusCode: EStatusCodeError.UNKNOWN_ERROR,
          message: 'http.serverError.internalServerError',
        });
      }
    }
  }

  @HttpApiResponse('role.inactive', RoleIdResDTO)
  @HttpApiRequest('Inactive role')
  @HttpApiError([
    ApiException(() => RoleNotFoundException, { description: 'Role not found' }),
    ApiException(() => RoleCanNotModifyException, { description: 'Role can not modify' }),
  ])
  @Patch('/update/:role/inactive')
  public async inactive(@ParamMongoId('role') _id: string): Promise<IResponse> {
    try {
      await this.roleService.inactive(_id);

      return { _id: String(_id) };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      } else {
        this.debuggerService.error('Role inactive server internal error', 'RoleController', 'inactive', error);

        throw new InternalServerErrorException({
          statusCode: EStatusCodeError.UNKNOWN_ERROR,
          message: 'http.serverError.internalServerError',
        });
      }
    }
  }

  @HttpApiResponse('role.active', RoleIdResDTO)
  @HttpApiRequest('Active role')
  @HttpApiError([
    ApiException(() => RoleNotFoundException, { description: 'Role not found' }),
    ApiException(() => RoleCanNotModifyException, { description: 'Role can not modify' }),
  ])
  @Patch('/update/:role/active')
  public async active(@ParamMongoId('role') _id: string): Promise<IResponse> {
    try {
      await this.roleService.inactive(_id);

      return { _id: String(_id) };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      } else {
        this.debuggerService.error('Role active server internal error', 'RoleController', 'active', error);

        throw new InternalServerErrorException({
          statusCode: EStatusCodeError.UNKNOWN_ERROR,
          message: 'http.serverError.internalServerError',
        });
      }
    }
  }
}
