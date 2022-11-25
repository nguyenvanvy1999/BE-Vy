import { Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserResDTO, SignUpBodyDTO } from '../dtos';
import { UserService } from '../services/user.service';
import {
  HttpApiError,
  HttpApiException,
} from '@src/modules/utils/error/error.decorator';
import { HttpControllerInit } from '@src/modules/utils/init';
import { HttpApiRequest } from '@src/modules/utils/request/request.decorator';
import { HttpApiResponse } from '@src/modules/utils/response/response.decorator';
import {
  UserEmailExistException,
  CreateFirebaseAccountException,
} from '../exceptions';
import { FirebaseGuard } from '../../auth/guards';
import { ReqUser } from '../../auth/decorators/req-user.decorator';
import { User } from '../schemas';
import { ApiBearerAuth } from '@nestjs/swagger';

@HttpControllerInit('User APIs', 'user', '1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @HttpApiRequest(
    'Signup with email and password',
    'Signup with email and password',
  )
  @HttpApiResponse('auth.signUp', UserResDTO)
  @HttpApiError([
    HttpApiException(() => UserEmailExistException, {
      description: 'Email already exist',
    }),
    HttpApiException(() => CreateFirebaseAccountException, {
      description: 'Create firebase account wrong',
    }),
  ])
  public async signUpWithEmailAndPassword(
    @Body() body: SignUpBodyDTO,
  ): Promise<UserResDTO> {
    return this.userService.signUpWithEmailAndPassword(body);
  }

  @Get('/logout')
  @UseGuards(FirebaseGuard)
  @ApiBearerAuth()
  @HttpApiRequest('Logout', 'Logout')
  @HttpApiResponse('auth.logout')
  @HttpApiError([], false, true, true)
  public async logOut(@ReqUser() user: User): Promise<void> {
    return this.userService.logout(user.firebaseUid);
  }

  @Get('/profile')
  @UseGuards(FirebaseGuard)
  @ApiBearerAuth()
  @HttpApiRequest('Get profile', 'Get profile')
  @HttpApiResponse('auth.getProfile', UserResDTO)
  @HttpApiError([], false, true, true)
  public async getProfile(@ReqUser() user: User): Promise<UserResDTO> {
    return new UserResDTO(user);
  }
}
