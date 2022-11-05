import { PickType } from '@nestjs/swagger';
import { UserCreateReqDTO } from '@src/modules/user/dtos/user.create.dto';

export class UserUpdateReqDTO extends PickType(UserCreateReqDTO, ['firstName', 'lastName', 'roles'] as const) {}
