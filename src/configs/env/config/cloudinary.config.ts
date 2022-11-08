import { registerAs } from '@nestjs/config';
import { envValidate } from '@src/configs';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CLDConfigDTO {
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  public CLD_CLOUD_NAME!: string;

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  public CLD_API_KEY!: string;

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  public CLD_API_SECRET!: string;
}

export interface ICLDConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

export const fnCLDConfig = (): ICLDConfig => {
  const config = envValidate<CLDConfigDTO>(process.env, CLDConfigDTO);

  return {
    cloud_name: config.CLD_CLOUD_NAME,
    api_key: config.CLD_API_KEY,
    api_secret: config.CLD_API_SECRET,
  };
};

export const cldConfig = registerAs('cld', fnCLDConfig);
