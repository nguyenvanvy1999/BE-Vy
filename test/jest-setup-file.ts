import 'reflect-metadata';

import { Environment } from '@src/configs';

process.env.APP_DEBUG = 'false';

process.env.APP_ENV = Environment.DEVELOPMENT;

process.env.APP_PORT = '3000';

process.env.APP_HOST = 'localhost';

process.env.APP_HTTP_ON = 'true';

process.env.APP_MICROSERVICE_ON = 'false';

process.env.APP_MODE = 'simple';

process.env.APP_NAME = 'mesh';

process.env.APP_TASK_ON = 'false';

process.env.APP_TZ = 'Asia/Jakarta';

process.env.APP_VERSIONING = 'false';

process.env.APP_LANGUAGE = 'en';

process.env.DATABASE_HOST = 'mongodb=//localhost=27017';

process.env.DATABASE_NAME = 'mesh';

process.env.DATABASE_DEBUG = 'false';

process.env.AWS_S3_REGION = 'string';

process.env.AWS_CREDENTIAL_KEY = 'string';

process.env.AWS_CREDENTIAL_SECRET = 'string';

process.env.AWS_SESSION_TOKEN = 'string';

process.env.AWS_S3_BUCKET = 'bucket';

process.env.SWAGGER_ENABLE = 'false';

process.env.SWAGGER_WRITE = 'false';

process.env.REDOC_ENABLE = 'false';

process.env.ASYNC_API_ENABLE = 'false';

process.env.REDOC_AUTH_ENABLE = 'false';

process.env.REDOC_USERNAME = 'string';

process.env.REDOC_PASSWORD = 'string';

process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY = '123456000';

process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED = '30d';

process.env.JWT_NOT_BEFORE_EXPIRES_IN = '30d';

process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED = '1h';

process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY = '123456';
