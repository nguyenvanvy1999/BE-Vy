import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsGuard } from '../auth/guards';
import { User } from '../user/schemas';
import { InjectFirebaseProvider } from '@cuaklabs/nestjs-firebase-admin';
import { Auth } from 'firebase-admin/auth';
import { UserCollection } from '../user/collections';
import { SocketCollection } from '../events/collections';
import { EProcessType } from '../events/interfaces';
import { WebSocketGatewayInit } from '../utils/init';
import { ReqWSUser } from '../auth/decorators';

@UseGuards(WsGuard)
@WebSocketGatewayInit(3006, { cors: true })
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');
  constructor(
    @InjectFirebaseProvider(Auth) private readonly auth: Auth,
    private readonly userCollection: UserCollection,
    private readonly socketCollection: SocketCollection,
  ) {}

  afterInit(): void {
    this.logger.log('Websocket init success', 'Websocket');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Connected ${client.id}`, 'Websocket');
    const user: User = await this.getDataUserFromToken(client);
    await this.socketCollection.create(
      user._id,
      user.userType,
      client,
      EProcessType.MAIN,
    );
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Disconnected ${client.id}`, 'Websocket');
    await this.socketCollection.deleteByWebSocketSocketId(client.id);
  }

  @SubscribeMessage('new-message')
  async messages(
    @ConnectedSocket() client: Socket,
    @MessageBody() body,
    @ReqWSUser() user: User,
  ) {
    try {
    } catch (error) {
      throw new WsException(error);
    }
  }

  async getDataUserFromToken(client: Socket): Promise<User> {
    try {
      const authToken: any = client.handshake?.query?.token;

      if (!authToken) {
        throw new WsException('Token not found');
      }
      try {
        const decoded = await this.auth.verifyIdToken(authToken);
        return await this.userCollection.getUserByFirebaseUid(decoded.uid);
      } catch (ex) {
        throw new WsException('Unauthorized');
      }
    } catch (error) {
      client.emit('exception', {
        ...error,
        timestamp: new Date().toISOString(),
      });
      client.disconnect();
    }
  }
}
