import { ApiProperty, OmitType } from '@nestjs/swagger';
import { RoleDetailResDTO } from '@src/modules/role/dtos';
import { UserCreateReqDTO } from '@src/modules/user/dtos/user.create.dto';
import { Exclude, Transform } from 'class-transformer';

export class UserResDTO extends OmitType(UserCreateReqDTO, ['roles'] as const) {
  @Transform(() => String)
  @ApiProperty({ description: '_id', nullable: false, required: true })
  _id: string;

  @ApiProperty({ description: 'createdAt', nullable: false, required: true })
  createdAt: Date;

  @ApiProperty({ type: [String], description: 'Roles' })
  roles: string[];

  @Exclude()
  readonly password: string;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly salt: string;
}

export class UserDetails extends OmitType(UserCreateReqDTO, ['roles'] as const) {
  @Transform(() => String)
  @ApiProperty({ description: '_id', nullable: false, required: true })
  _id: string;

  @ApiProperty({ description: 'createdAt', nullable: false, required: true })
  createdAt: Date;

  @ApiProperty({ type: [RoleDetailResDTO], description: 'Roles' })
  roles: RoleDetailResDTO[];

  @Exclude()
  readonly password: string;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly salt: string;
}
