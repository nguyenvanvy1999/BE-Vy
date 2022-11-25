import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ECollectionName } from '../../../utils/database';

import { WebSocketSchema } from '../../schemas';
import { SocketCollection } from './socket.collection';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ECollectionName.SOCKET,
        schema: WebSocketSchema,
      },
    ]),
  ],
  providers: [SocketCollection],
  exports: [SocketCollection],
})
export class SocketCollectionModule {}
