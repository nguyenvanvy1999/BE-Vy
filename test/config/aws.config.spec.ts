import type { IAWSConfig } from '@src/configs/env/config';
import { fnAWSConfig } from '@src/configs/env/config';

const setEnv = (): void => {
  process.env.AWS_CREDENTIAL_KEY = 'key';
  process.env.AWS_CREDENTIAL_SECRET = 'secret';
  process.env.AWS_SESSION_TOKEN = 'token';
  process.env.AWS_S3_BUCKET = 'bucket';
  process.env.AWS_S3_REGION = 'region';
};

describe('AWS config test', () => {
  const awsConfig: IAWSConfig = {
    credential: {
      key: 'key',
      secret: 'secret',
      token: 'token',
    },
    s3: {
      bucket: 'bucket',
      region: 'region',
      baseUrl: 'https://bucket.s3.region.amazonaws.com',
    },
  };

  it('Should return AWS config', () => {
    setEnv();
    const config = fnAWSConfig();
    expect(config).toStrictEqual(awsConfig);
  });

  it('Should return default value when some value not set', () => {
    delete process.env.AWS_S3_BUCKET;
    const config = fnAWSConfig();
    expect(config).toStrictEqual(awsConfig);
  });

  it('Should throw error when AWS_CREDENTIAL_KEY not set', () => {
    setEnv();
    delete process.env.AWS_CREDENTIAL_KEY;
    expect(() => fnAWSConfig()).toThrow();
  });

  it('Should throw error when AWS_CREDENTIAL_SECRET not set', () => {
    setEnv();
    delete process.env.AWS_CREDENTIAL_SECRET;
    expect(() => fnAWSConfig()).toThrow();
  });

  it('Should throw error when AWS_SESSION_TOKEN not set', () => {
    setEnv();
    delete process.env.AWS_SESSION_TOKEN;
    expect(() => fnAWSConfig()).toThrow();
  });

  it('Should throw error when AWS_S3_REGION not set', () => {
    setEnv();
    delete process.env.AWS_S3_REGION;
    expect(() => fnAWSConfig()).toThrow();
  });
});
