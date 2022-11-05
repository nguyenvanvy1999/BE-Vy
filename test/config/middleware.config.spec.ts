import type { IMiddlewareConfig } from '@src/configs/env/config';
import { fnMiddlewareConfig } from '@src/configs/env/config';

describe('Middleware config test', () => {
  it('Should return middleware config', () => {
    const middlewareConfig: IMiddlewareConfig = {
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
        resetTime: 500,
        maxRequestPerId: 1,
      },
      timestamp: {
        toleranceTimeInMinutes: Number.parseInt(process.env.MIDDLEWARE_TOLERANCE_TIMESTAMP, 10) || 5,
      },
    };
    const config = fnMiddlewareConfig();
    expect(config).toStrictEqual(middlewareConfig);
  });
});
