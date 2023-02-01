import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { envValidate } from '../services';

export class FirebaseConfigDTO {
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  public API_KEY: string;

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  public AUTH_DOMAIN: string;

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  public PROJECT_ID: string;

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  public STORAGE_BUCKET: string;

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  public MESSAGING_SENDER_ID: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public APP_ID: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public MEASUREMENT_ID: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public CLIENT_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public PRIVATE_KEY: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public FIREBASE_DATABASE_URL: string;
}

export interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  clientEmail: string;
  privateKey: string;
  databaseUrl: string;
}

export const fnDatabaseConfig = (): IFirebaseConfig => {
  const config = envValidate<FirebaseConfigDTO>(process.env, FirebaseConfigDTO);

  return {
    apiKey: config.API_KEY,
    authDomain: config.AUTH_DOMAIN,
    projectId: config.PROJECT_ID,
    storageBucket: config.STORAGE_BUCKET,
    messagingSenderId: config.MESSAGING_SENDER_ID,
    appId: config.APP_ID,
    measurementId: config.MEASUREMENT_ID,
    clientEmail: config.CLIENT_EMAIL,
    privateKey: config.PRIVATE_KEY,
    databaseUrl: config.FIREBASE_DATABASE_URL,
  };
};

export const firebaseConfig = registerAs('firebase', fnDatabaseConfig);
