import { ApiProperty } from '@nestjs/swagger';
import { EUserType, EUserTypeList } from '../constants';
import { User } from '../schemas';

export class UserResDTO {
  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
  })
  _id: string;

  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    format: 'email',
  })
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
  })
  firstName: string;

  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
  })
  lastName: string;

  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    enum: EUserTypeList,
    enumName: 'EUserType',
  })
  userType: EUserType;

  @ApiProperty()
  isActive: boolean;

  constructor(user: User) {
    if (!user) return;
    this._id = user._id.toString();
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.userType = user.userType;
    this.isActive = user.isActive;
  }
}
