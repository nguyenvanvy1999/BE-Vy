import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import compression from 'compression';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    compression()(req, res, next);
  }
}
