import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { IDeleteResultMongo } from '../../../base/interfaces';
import { EUserType } from '../../../user/constants';
import { ECollectionName } from '../../../utils/database';
import { EProcessType } from '../../interfaces';

import { WebSocket } from '../../schemas';

@Injectable()
export class SocketCollection {
  constructor(
    @InjectModel(ECollectionName.SOCKET)
    private readonly socketModel: Model<WebSocket>,
  ) {}

  async getListSocketsByUserTypes(
    pageLoad: { skip?: number; limit?: number },
    userTypes: EUserType[],
  ): Promise<WebSocket[]> {
    if (!userTypes?.length) {
      return [] as WebSocket[];
    }

    const sockets = await this.socketModel
      .find({
        userType: { $in: userTypes },
      })
      .skip(pageLoad.skip)
      .limit(pageLoad.limit);

    return sockets;
  }

  async getSocketsByUserId(
    userId: ObjectId,
    processType = EProcessType.MAIN,
  ): Promise<WebSocket[]> {
    return this.socketModel.find({
      userId,
      processType,
    });
  }

  async getSocketsByUserIds(
    userIds: ObjectId[],
    processType = EProcessType.MAIN,
  ): Promise<WebSocket[]> {
    return this.socketModel.find({
      userId: { $in: userIds },
      processType,
    });
  }

  /**
   * @param userId User's Id
   * @param deviceId OneSignal Device's Id
   * @param processType PROCESS_TYPE
   */
  async getSocketsByUserIdAndDeviceId(
    userId: ObjectId,
    deviceId: string,
    processType: EProcessType,
  ): Promise<WebSocket[]> {
    return this.socketModel.find({
      userId,
      deviceId,
      processType,
    });
  }

  /**
   * @param socketId WebSocket Socket's Id
   */
  async getSocketByWebSocketSocketId(socketId: string): Promise<WebSocket> {
    return this.socketModel.findOne({ socketId });
  }

  async create(
    userId: ObjectId,
    userType: EUserType,
    socket: Socket,
    processType: EProcessType,
    deviceId?: string,
  ): Promise<WebSocket> {
    return this.socketModel.create({
      _id: new ObjectId(),
      userId,
      userType,
      socketId: socket.id,
      processType,
      deviceId,
    } as WebSocket);
  }

  /**
   * @param socketId WebSocket Socket's Id
   */
  async deleteByWebSocketSocketId(
    socketId: string,
  ): Promise<IDeleteResultMongo> {
    return this.socketModel.deleteMany({
      socketId,
    });
  }

  /**
   * @param sockets List of WebSocket's Sockets
   */
  async deleteWebSocketsByWebSocketSocketsIds(
    sockets: Socket[],
  ): Promise<IDeleteResultMongo> {
    return this.socketModel.deleteMany({
      socketId: { $in: sockets.map((socket) => socket.id) },
    });
  }
}
