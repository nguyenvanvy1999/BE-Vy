import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { WSErrorExceptionDTO } from './error.interface';
import { Socket } from 'socket.io';

@Catch(WsException)
export class ErrorWebsocketFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as Socket;

    if (!(exception instanceof WsException)) {
      return client.emit('exception', {
        statusCode: 500,
        message: 'InternalServerError',
      });
    }

    const error = exception.getError();
    const tmp: WSErrorExceptionDTO = {
      errors: error as any,
      message: exception.message,
      timestamp: new Date().toISOString(),
    };

    return client.emit('exception', tmp);
  }
}
