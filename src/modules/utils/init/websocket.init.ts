import { applyDecorators, UseFilters, UsePipes } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { ErrorWebsocketFilter } from '../error/error-websocket.filter';
import { SocketValidationPipe } from '../request/validation';

export const WebSocketGatewayInit = <T extends Record<string, any>>(
  port?: number,
  options?: T,
) =>
  applyDecorators(
    WebSocketGateway(port, options),
    UsePipes(new SocketValidationPipe()),
    UseFilters(new ErrorWebsocketFilter()),
  );
