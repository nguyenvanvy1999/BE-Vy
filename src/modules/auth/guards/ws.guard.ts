import { InjectFirebaseProvider } from '@cuaklabs/nestjs-firebase-admin';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Auth } from 'firebase-admin/auth';
import { Socket } from 'socket.io';
import { UserCollection } from '../../user/collections';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private readonly userCollection: UserCollection,
    @InjectFirebaseProvider(Auth) private readonly auth: Auth,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | any | Promise<boolean | any>> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const authToken: any = client.handshake?.query?.token;
    if (!authToken) return false;
    try {
      const decoded = await this.auth.verifyIdToken(authToken);
      const user = await this.userCollection.getUserByFirebaseUid(decoded.uid);
      context.switchToWs().getClient().user = user;
      return true;
    } catch (ex) {
      return false;
    }
  }
}
