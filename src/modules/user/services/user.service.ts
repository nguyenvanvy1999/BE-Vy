import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DebuggerService } from '@src/modules/debugger/services/debugger.service';
import { RoleSchema } from '@src/modules/role/schemas';
import { UserResDTO } from '@src/modules/user/dtos';
import { UserNotFoundException } from '@src/modules/user/exceptions';
import type { UserDocument } from '@src/modules/user/schemas';
import { UserSchema } from '@src/modules/user/schemas';
import type { IAuthPassword, IUserCheckExist, IUserCreate, IUserUpdate } from '@src/modules/user/user.interface';
import type { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from '@src/modules/utils/database';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
    private readonly debuggerService: DebuggerService,
  ) {}

  public async findAll(find?: Record<string, any>, options?: IDatabaseFindAllOptions): Promise<UserDocument[]> {
    const users = this.userModel.find(find).populate({
      path: 'role',
      model: RoleSchema.name,
    });

    if (options && options.limit !== undefined && options.skip !== undefined) {
      users.limit(options.limit).skip(options.skip);
    }

    if (options && options.sort) {
      users.sort(options.sort);
    }

    return users.lean();
  }

  public async getTotal(find?: Record<string, any>): Promise<number> {
    return this.userModel.countDocuments(find);
  }

  public async findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T> {
    const user = this.userModel.findById(_id);

    if (options?.populate?.role) {
      user.populate({
        path: 'role',
        model: RoleSchema.name,
      });
    }

    return user.lean();
  }

  public async findByIdOrThrow(_id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(_id);

    if (!user) {
      this.debuggerService.error('User not found', 'UserService', 'findByIdOrThrow');

      throw new UserNotFoundException();
    }

    return user;
  }

  public async findOne<T>(find?: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<T> {
    const user = this.userModel.findOne(find);

    if (options?.populate?.role) {
      user.populate({
        path: 'role',
        model: RoleSchema.name,
      });
    }

    return user.lean();
  }

  public async create({
    firstName,
    lastName,
    password,
    passwordExpired,
    salt,
    email,
    mobileNumber,
    roles,
  }: IUserCreate): Promise<UserDocument> {
    const user = {
      firstName,
      email,
      mobileNumber,
      password,
      roles: roles.map((role) => new Types.ObjectId(role)),
      isActive: true,
      lastName: lastName || undefined,
      salt,
      passwordExpired,
    };

    const create: UserDocument = new this.userModel(user);

    return create.save();
  }

  public async deleteOneById(_id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(_id);
  }

  public async deleteOne(find: Record<string, any>): Promise<UserDocument> {
    return this.userModel.findOneAndDelete(find);
  }

  public async updateOneById(_id: string, { firstName, lastName }: IUserUpdate): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(_id, { firstName, lastName });
  }

  public async checkExist(email: string, mobileNumber: string, _id?: string): Promise<IUserCheckExist> {
    const existEmail: Record<string, any> = await this.userModel.exists({
      email: {
        $regex: new RegExp(email),
        $options: 'i',
      },
      _id: { $nin: [new Types.ObjectId(_id)] },
    });

    const existMobileNumber: Record<string, any> = await this.userModel.exists({
      mobileNumber,
      _id: { $nin: [new Types.ObjectId(_id)] },
    });

    return {
      email: Boolean(existEmail),
      mobileNumber: Boolean(existMobileNumber),
    };
  }

  public async updatePassword(
    _id: string,
    { salt, passwordHash, passwordExpired }: IAuthPassword,
  ): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(_id, { salt, passwordHash, passwordExpired });
  }

  public async updatePasswordExpired(_id: string, passwordExpired: Date): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(_id, { passwordExpired });
  }

  public async inactive(_id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(_id, { isActive: false });
  }

  public async active(_id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(_id, { isActive: true });
  }

  public serializationList(data: UserDocument[]): UserResDTO[] {
    return plainToInstance(UserResDTO, data);
  }

  public serializationGet(data: UserDocument): UserResDTO {
    return plainToInstance(UserResDTO, data);
  }
}
