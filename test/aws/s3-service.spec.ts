import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { CustomConfigService } from '@src/configs/env';
import { S3Service } from '@src/modules/aws';
import { S3 } from 'aws-sdk';
import { createAwsServiceMock, createAwsServicePromisableSpy, getAwsServiceMock } from 'nest-aws-sdk/dist/testing';

describe('S3Service', () => {
  let service: S3Service;
  let module: TestingModule;
  let s3: S3;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        S3Service,
        createAwsServiceMock(S3, {
          useValue: {
            deleteObject: () => 'response',
            copyObject: () => 'response',
          },
        }),
        {
          provide: CustomConfigService,
          useValue: {
            getString: () => 'string',
          },
        },
      ],
    }).compile();
    service = module.get<S3Service>(S3Service);
    s3 = getAwsServiceMock(module, S3);
  });

  describe('S3Service define', () => {
    it('Should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('S3Service deleteFile', () => {
    test('Should call the method with correct bucket and key', async () => {
      const spy: jest.SpyInstance = createAwsServicePromisableSpy(s3, 'deleteObject', 'resolve');
      await service.deleteFile('myKey');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ Bucket: 'string', Key: 'myKey' });
    });

    test('Should throw error when error', async () => {
      const spy: jest.SpyInstance = createAwsServicePromisableSpy(s3, 'deleteObject', 'reject', 'Error');
      await expect(service.deleteFile('myKey')).rejects.toThrow();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ Bucket: 'string', Key: 'myKey' });
    });
  });

  describe('S3Service duplicateFile', () => {
    test('Should call method with correct bucket and key', async () => {
      const spy: jest.SpyInstance = createAwsServicePromisableSpy(s3, 'copyObject', 'resolve');
      await service.duplicateFile('oldUrl', 'newUrl');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        Bucket: 'string',
        CopySource: 'oldUrl',
        Key: 'newUrl',
        ACL: 'public-read',
      });
    });

    test('Should call method with correct bucket and key', async () => {
      const spy: jest.SpyInstance = createAwsServicePromisableSpy(s3, 'copyObject', 'reject', 'Error');
      await expect(service.duplicateFile('oldUrl', 'newUrl')).rejects.toThrow();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        Bucket: 'string',
        CopySource: 'oldUrl',
        Key: 'newUrl',
        ACL: 'public-read',
      });
    });
  });
});
