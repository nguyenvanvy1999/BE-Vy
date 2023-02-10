import {
  Body,
  Get,
  UseGuards,
  Patch,
  Query,
  Post,
  Delete,
} from '@nestjs/common';
import {
  UserResDTO,
  UpdateUserDto,
  SearchUserReqDto,
  SignUpBodyDTO,
} from '../dtos';
import { UserService } from '../services/user.service';
import { HttpControllerInit } from '@src/modules/utils/init';
import { HttpApiRequest } from '@src/modules/utils/request/request.decorator';
import { HttpApiResponse } from '@src/modules/utils/response/response.decorator';
import { FirebaseGuard } from '../../auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators';
import { EUserType } from '../constants';
import { isNotNullAndUndefined } from '../../utils/functions';
import {
  HttpApiError,
  HttpApiException,
} from '../../utils/error/error.decorator';
import {
  UserEmailExistException,
  CreateFirebaseAccountException,
} from '../exceptions';

@HttpControllerInit('Admin user APIs', 'admin/user', '1')
@ApiBearerAuth()
@UseGuards(FirebaseGuard)
@Roles(EUserType.ADMIN)
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/update')
  @HttpApiRequest('Update user', 'Update user')
  @HttpApiResponse('http.success.ok', UserResDTO)
  public updateUser(@Body() body: UpdateUserDto): Promise<UserResDTO> {
    return this.userService.updateUser(body);
  }

  @Get('/search')
  @HttpApiRequest('Search user', 'Search user')
  @HttpApiResponse('http.success.ok', UserResDTO)
  public async searchUsers(
    @Query() { textSearch, isActive }: SearchUserReqDto,
  ): Promise<UserResDTO[]> {
    const conditions: any[] = [{ userType: EUserType.USER }];
    if (textSearch) {
      const regex = new RegExp(textSearch, 'i');
      conditions.push({
        $or: [
          { email: { $regex: regex } },
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
        ],
      });
    }
    if (isNotNullAndUndefined(isActive)) {
      conditions.push({ isActive });
    }
    const find = conditions.length ? { $and: conditions } : {};
    return this.userService.searchUsers(find);
  }

  @Post('/create')
  @HttpApiRequest(
    'Create user with email and password',
    'Create user with email and password',
  )
  @HttpApiResponse('http.success.ok', UserResDTO)
  @HttpApiError([
    HttpApiException(() => UserEmailExistException, {
      description: 'Email already exist',
    }),
    HttpApiException(() => CreateFirebaseAccountException, {
      description: 'Create firebase account wrong',
    }),
  ])
  public async createUser(@Body() body: SignUpBodyDTO): Promise<UserResDTO> {
    return this.userService.signUpWithEmailAndPassword(body, true);
  }

  @Delete()
  @HttpApiRequest('Delete user', 'Delete user')
  @HttpApiResponse('http.success.ok')
  public async deleteUser(@Query('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
