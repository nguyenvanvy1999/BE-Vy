import { registerAs } from '@nestjs/config';

export interface IMiddlewareConfig {
  cors: {
    allowMethod: string[];
    allowOrigin: string;
    allowHeader: string[];
  };
  rateLimit: {
    resetTime: number;
    maxRequestPerId: number;
  };
  timestamp: {
    toleranceTimeInMinutes: number;
  };
}

export const fnMiddlewareConfig = (): IMiddlewareConfig => ({
  cors: {
    allowMethod: ['GET', 'DELETE', 'PUT', 'PATCH', 'POST'],
    allowOrigin: '*',
    allowHeader: [
      'Accept',
      'Accept-Language',
      'Content-Language',
      'Content-Type',
      'Origin',
      'Authorization',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Credentials',
      'Access-Control-Expose-Headers',
      'Access-Control-Max-Age',
      'Referer',
      'Host',
      'X-Requested-With',
      'x-custom-lang',
      'x-timestamp',
      'x-api-key',
      'user-agent',
    ],
  },
  rateLimit: {
    resetTime: 500, // 0.5 secs
    maxRequestPerId: 1, // max request per reset time
  },
  timestamp: {
    toleranceTimeInMinutes: Number.parseInt(process.env.MIDDLEWARE_TOLERANCE_TIMESTAMP, 10) || 5, // 5 mins
  },
});

export const middlewareConfig = registerAs('middleware', fnMiddlewareConfig);
