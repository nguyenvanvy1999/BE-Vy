import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
import { EEventType } from './dtos/event-type.enum';
import { OnEvent } from '@nestjs/event-emitter';
import { DataResDTO } from '../data/dtos';
import { DOOR, FirebaseRealtimeService } from '../realtime';
import { DOOR_STATUS } from '../realtime/door-status.enum';
import { Subject } from 'rxjs';

@WebSocketGatewayInit()
@UseGuards(WsGuard)
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  readonly inDoorSubject = new Subject<DOOR_STATUS>();
  private readonly inDoor$ = this.inDoorSubject.asObservable();

  readonly outDoorSubject = new Subject<DOOR_STATUS>();
  private readonly outDoor$ = this.outDoorSubject.asObservable();

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');
  constructor(
    @InjectFirebaseProvider(Auth) private readonly auth: Auth,
    private readonly userCollection: UserCollection,
    private readonly socketCollection: SocketCollection,
    private readonly realtimeService: FirebaseRealtimeService,
  ) {
    // delay 15s before close door
    this.inDoor$.subscribe({
      next: async (status: DOOR_STATUS) => {
        await this.realtimeService.checkCloseDoorCondition(DOOR.IN);
        this.realtimeService.controlDoor({ door: DOOR.IN, status });
      },
    });

    this.outDoor$.subscribe({
      next: async (status: DOOR_STATUS) => {
        await this.realtimeService.checkCloseDoorCondition(DOOR.OUT);
        this.realtimeService.controlDoor({ door: DOOR.OUT, status });
      },
    });
  }

  afterInit(): void {
    this.logger.log('Websocket init success');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Connected ${client.id}`);
    const user: User = await this.getDataUserFromToken(client);
    await this.socketCollection.create(
      user._id,
      user.userType,
      client,
      EProcessType.MAIN,
    );
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Disconnected ${client.id}`);
    await this.socketCollection.deleteByWebSocketSocketId(client.id);
  }

  @OnEvent(EEventType.IN)
  async inData(payload: DataResDTO) {
    try {
      this.realtimeService.controlDoor({
        door: DOOR.IN,
        status: DOOR_STATUS.OPEN,
      });
      this.inDoorSubject.next(DOOR_STATUS.CLOSE);
      this.server.emit(EEventType.IN, payload);
    } catch (error) {
      throw new WsException(error);
    }
  }

  @OnEvent(EEventType.OUT)
  async outData(payload: DataResDTO) {
    try {
      this.server.emit(EEventType.OUT, payload);
    } catch (error) {
      throw new WsException(error);
    }
  }

  @OnEvent(EEventType.PAYMENT)
  async payment(payload: DataResDTO) {
    try {
      this.realtimeService.controlDoor({
        door: DOOR.OUT,
        status: DOOR_STATUS.OPEN,
      });
      this.outDoorSubject.next(DOOR_STATUS.CLOSE);
      this.server.emit(EEventType.PAYMENT, payload);
    } catch (error) {
      throw new WsException(error);
    }
  }

  @OnEvent(EEventType.ERROR)
  async sendError(payload) {
    try {
      this.server.emit(EEventType.ERROR, payload);
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
