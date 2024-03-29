/* eslint-disable max-classes-per-file */
import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import bodyParser from 'body-parser';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class UrlencodedBodyParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.urlencoded({ extended: false })(req, res, next);
  }
}

@Injectable()
export class JsonBodyParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.json()(req, res, next);
  }
}

@Injectable()
export class RawBodyParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.raw()(req, res, next);
  }
}

@Injectable()
export class TextBodyParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.text()(req, res, next);
  }
}

@Injectable()
export class HtmlBodyParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.raw({ type: 'text/html' })(req, res, next);
  }
}
