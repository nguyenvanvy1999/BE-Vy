import { registerAs } from '@nestjs/config';
import { envValidate } from '@src/configs';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AWSConfigDTO {
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  public AWS_CREDENTIAL_KEY!: string;

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  public AWS_CREDENTIAL_SECRET!: string;

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  public AWS_SESSION_TOKEN!: string;

  @IsString()
  @Type(() => String)
  @IsOptional()
  public AWS_S3_BUCKET? = 'bucket';

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  public AWS_S3_REGION!: string;
}

export interface IAWSConfig {
  credential: {
    key: string;
    secret: string;
    token: string;
  };
  s3: {
    bucket: string;
    region: string;
    baseUrl: string;
  };
}

export const fnAWSConfig = (): IAWSConfig => {
  const config = envValidate<AWSConfigDTO>(process.env, AWSConfigDTO);

  return {
    credential: {
      key: config.AWS_CREDENTIAL_KEY,
      secret: config.AWS_CREDENTIAL_SECRET,
      token: config.AWS_SESSION_TOKEN,
    },
    s3: {
      bucket: config.AWS_S3_BUCKET,
      region: config.AWS_S3_REGION,
      baseUrl: `https://${config.AWS_S3_BUCKET}.s3.${config.AWS_S3_REGION}.amazonaws.com`,
    },
  };
};

export const awsConfig = registerAs('aws', fnAWSConfig);
