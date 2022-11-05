import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  constructor(@InjectAwsService(S3) private readonly s3: S3, private readonly config: ConfigService) {}

  public async deleteFile(key: string): Promise<void> {
    try {
      await this.s3.deleteObject({ Bucket: this.config.get<string>('aws.s3.bucket'), Key: key }).promise();

      return;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async listBucket(): Promise<string[]> {
    const listBucket = await this.s3.listBuckets().promise();

    return listBucket.Buckets.map((val) => val.Name);
  }

  public async duplicateFile(oldUrl: string, newUrl: string): Promise<void> {
    try {
      const params = {
        Bucket: this.config.get<string>('aws.s3.bucket'),
        CopySource: oldUrl,
        Key: newUrl,
        ACL: 'public-read',
      };
      await this.s3.copyObject(params).promise();

      return;
    } catch (error) {
      throw new Error(error);
    }
  }
}
