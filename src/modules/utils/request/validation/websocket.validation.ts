import { Injectable, ValidationPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors = []) => {
      console.log(validationErrors);

      if (this.isDetailedOutputDisabled) {
        return new WsException('Bad request');
      }
      const errors = this.flattenValidationErrors(validationErrors);

      return new WsException(errors);
    };
  }
}
