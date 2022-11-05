import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  BadRequestException,
  Body,
  Delete,
  Get,
  InternalServerErrorException,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AuthService } from '@src/modules/auth/services';
import { DebuggerService } from '@src/modules/debugger/services/debugger.service';
import { RoleNotFoundException } from '@src/modules/role/exceptions';
import { RoleService } from '@src/modules/role/services';
import type { UserResDTO } from '@src/modules/user/dtos';
import { UserCreateReqDTO, UserListReqDTO, UserUpdateReqDTO } from '@src/modules/user/dtos';
import { UserEmailExistException, UserExistException } from '@src/modules/user/exceptions/exist.exception';
import type { UserDocument } from '@src/modules/user/schemas';
import { UserService } from '@src/modules/user/services';
import { EStatusCodeError } from '@src/modules/utils/error/error.constant';
import { HttpApiError } from '@src/modules/utils/error/error.decorator';
import { HttpControllerInit } from '@src/modules/utils/init';
import { PaginationService } from '@src/modules/utils/pagination/service/pagination.service';
import { ParamMongoId } from '@src/modules/utils/pipes';
import { HttpApiRequest } from '@src/modules/utils/request/request.decorator';
import { HttpApiResponse } from '@src/modules/utils/response/response.decorator';
import type { IResponse, IResponsePaging } from '@src/modules/utils/response/response.interface';

import { UserNotFoundException } from '../exceptions';
import { EUserStatusCodeError } from '../user.constant';
import type { IUserCheckExist } from '../user.interface';

@HttpControllerInit('User Admin APIs', 'user', '1')
export class UserAdminController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
  ) {}

  @HttpApiRequest('Get list of user')
  @HttpApiResponse('user.list', UserListReqDTO)
  @HttpApiError()
  @Get('/list')
  async list(
    @Query()
    { page, perPage, sort, search, availableSort, availableSearch }: UserListReqDTO,
  ): Promise<IResponsePaging> {
    const skip: number = this.paginationService.skip(page, perPage);
    const find: Record<string, any> = {};

    if (search) {
      find.$or = [
        {
          firstName: {
            $regex: new RegExp(search),
            $options: 'i',
          },
          lastName: {
            $regex: new RegExp(search),
            $options: 'i',
          },
          email: {
            $regex: new RegExp(search),
            $options: 'i',
          },
          mobileNumber: search,
        },
      ];
    }

    const users: UserDocument[] = await this.userService.findAll(find, {
      limit: perPage,
      skip,
      sort,
    });
    const totalData: number = await this.userService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(totalData, perPage);

    const data: UserResDTO[] = this.userService.serializationList(users);

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

  @HttpApiRequest('Get user', 'Get user by id')
  @HttpApiResponse('user.get', UserListReqDTO)
  @HttpApiError([ApiException(() => UserNotFoundException, { description: 'User not found' })])
  @Get('get/:user')
  async get(@ParamMongoId('user') _id: string): Promise<IResponse> {
    const user = await this.userService.findByIdOrThrow(_id);

    return this.userService.serializationGet(user);
  }

  @HttpApiRequest('Create user')
  @HttpApiResponse('user.create', UserListReqDTO)
  @HttpApiError()
  @Post('/create')
  async create(
    @Body()
    body: UserCreateReqDTO,
  ): Promise<IResponse> {
    const checkExist: IUserCheckExist = await this.userService.checkExist(body.email, body.mobileNumber);

    if (checkExist.email && checkExist.mobileNumber) {
      this.debuggerService.error('create user exist', 'UserController', 'create');

      throw new UserExistException();
    } else if (checkExist.email) {
      this.debuggerService.error('create user exist', 'UserController', 'create');

      throw new UserEmailExistException();
    } else if (checkExist.mobileNumber) {
      this.debuggerService.error('create user exist', 'UserController', 'create');

      throw new BadRequestException({
        statusCode: EUserStatusCodeError.USER_MOBILE_NUMBER_EXIST_ERROR,
        message: 'user.error.mobileNumberExist',
      });
    }

    const role = await this.roleService.checkRolesAreValid(body.roles);

    if (!role) {
      this.debuggerService.error('Role not found', 'UserController', 'create');

      throw new RoleNotFoundException();
    }

    try {
      const password = await this.authService.createPassword(body.password);

      const create = await this.userService.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        mobileNumber: body.mobileNumber,
        roles: body.roles,
        password: password.passwordHash,
        passwordExpired: password.passwordExpired,
        salt: password.salt,
      });

      return {
        _id: create._id,
      };
    } catch (error: any) {
      this.debuggerService.error('create try catch', 'UserController', 'create', error);

      throw new InternalServerErrorException({
        statusCode: EStatusCodeError.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @HttpApiRequest('Delete user')
  @HttpApiResponse('user.delete', UserListReqDTO)
  @HttpApiError()
  @Delete('/delete/:user')
  async delete(@ParamMongoId('user') _id: string): Promise<void> {
    try {
      const user = await this.userService.findByIdOrThrow(_id);
      await this.userService.deleteOneById(user._id);
    } catch (error) {
      this.debuggerService.error('delete try catch', 'UserController', 'create', error);

      throw new InternalServerErrorException({
        statusCode: EStatusCodeError.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @HttpApiRequest('Update user')
  @HttpApiResponse('user.update', UserListReqDTO)
  @HttpApiError()
  @Put('/update/:user')
  async update(
    @ParamMongoId('user') _id: string,
    @Body()
    body: UserUpdateReqDTO,
  ): Promise<IResponse> {
    const user = await this.userService.findByIdOrThrow(_id);

    try {
      await this.userService.updateOneById(user._id, body);
    } catch (error: any) {
      this.debuggerService.error('update try catch', 'UserController', 'update', error);

      throw new InternalServerErrorException({
        statusCode: EStatusCodeError.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }

    return {
      _id: user._id,
    };
  }

  @HttpApiRequest('Inactive user')
  @HttpApiResponse('user.inactive', UserListReqDTO)
  @HttpApiError()
  @Patch('/update/:user/inactive')
  async inactive(@ParamMongoId('user') _id: string): Promise<IResponse> {
    const user = await this.userService.findByIdOrThrow(_id);

    try {
      await this.userService.inactive(user._id);
    } catch (error) {
      this.debuggerService.error('User inactive server internal error', 'UserController', 'inactive', error);

      throw new InternalServerErrorException({
        statusCode: EStatusCodeError.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }

    return {
      _id: user._id,
    };
  }

  @HttpApiRequest('Active user')
  @HttpApiResponse('user.active', UserListReqDTO)
  @HttpApiError()
  @Patch('/update/:user/active')
  async active(@ParamMongoId('user') _id: string): Promise<IResponse> {
    const user = await this.userService.findByIdOrThrow(_id);

    try {
      await this.userService.active(user._id);
    } catch (error) {
      this.debuggerService.error('User active server internal error', 'UserController', 'active', error);

      throw new InternalServerErrorException({
        statusCode: EStatusCodeError.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }

    return {
      _id: user._id,
    };
  }
}
