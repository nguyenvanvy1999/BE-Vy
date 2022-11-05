import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { CustomConfigService } from '@src/configs/env';
import { WSService } from '@src/modules/aws';
import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk';
import { createAwsServiceMock, createAwsServicePromisableSpy, getAwsServiceMock } from 'nest-aws-sdk/dist/testing';

describe('WSService', () => {
  let service: WSService;
  let module: TestingModule;
  let ddb: DynamoDB;
  let api: ApiGatewayManagementApi;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        WSService,
        createAwsServiceMock(DynamoDB, {
          useValue: {
            executeStatement: () => 'response',
            deleteItem: () => 'response',
          },
        }),
        createAwsServiceMock(ApiGatewayManagementApi, {
          useValue: {
            postToConnection: () => 'response',
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
    service = module.get<WSService>(WSService);
    ddb = getAwsServiceMock(module, DynamoDB);
    api = getAwsServiceMock(module, ApiGatewayManagementApi);
  });

  describe('WSService define', () => {
    it('Should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('WSService sendWSMessage', () => {
    test('Should postToConnection when have connections', async () => {
      const ddbMock = {
        Items: [{ connectionId: { S: 'key' } }, { connectionId: { S: 'key2' } }],
      };
      const ddbSpy: jest.SpyInstance = createAwsServicePromisableSpy(ddb, 'executeStatement', 'resolve', ddbMock);
      const apiSpy: jest.SpyInstance = createAwsServicePromisableSpy(api, 'postToConnection', 'resolve');
      const data = { message: '123123' };
      await service.sendWSMessage(['123'], data);
      expect(ddbSpy).toHaveBeenCalledTimes(1);
      expect(ddbSpy).toHaveBeenCalledWith({
        Statement: 'SELECT "userId", "connectionId" FROM "string" WHERE "userId" IN [\'123\'];',
      });
      expect(apiSpy).toHaveBeenCalledTimes(ddbMock.Items.length);
      expect(apiSpy).toHaveBeenNthCalledWith(1, {
        Data: JSON.stringify(data),
        ConnectionId: ddbMock.Items[0].connectionId.S,
      });
      expect(apiSpy).toHaveBeenNthCalledWith(2, {
        Data: JSON.stringify(data),
        ConnectionId: ddbMock.Items[1].connectionId.S,
      });
      expect(apiSpy).toHaveBeenLastCalledWith({
        Data: JSON.stringify(data),
        ConnectionId: ddbMock.Items[1].connectionId.S,
      });
    });

    test('Should not postToConnection when dont have connection', async () => {
      const ddbMock = { Items: [] };
      const ddbSpy: jest.SpyInstance = createAwsServicePromisableSpy(ddb, 'executeStatement', 'resolve', ddbMock);
      const apiSpy: jest.SpyInstance = createAwsServicePromisableSpy(api, 'postToConnection', 'resolve');
      const data = { message: '123123' };
      await service.sendWSMessage(['123'], data);
      expect(ddbSpy).toHaveBeenCalledTimes(1);
      expect(ddbSpy).toHaveBeenCalledWith({
        Statement: 'SELECT "userId", "connectionId" FROM "string" WHERE "userId" IN [\'123\'];',
      });
      expect(apiSpy).toHaveBeenCalledTimes(0);
    });

    test('Should not postToConnection when get connection error', async () => {
      const ddbSpy: jest.SpyInstance = createAwsServicePromisableSpy(
        ddb,
        'executeStatement',
        'reject',
        new Error('Error'),
      );
      const apiSpy: jest.SpyInstance = createAwsServicePromisableSpy(api, 'postToConnection', 'resolve');
      const data = { message: '123123' };
      await expect(service.sendWSMessage(['123'], data)).rejects.toThrow();
      expect(ddbSpy).toHaveBeenCalledTimes(1);
      expect(ddbSpy).toHaveBeenCalledWith({
        Statement: 'SELECT "userId", "connectionId" FROM "string" WHERE "userId" IN [\'123\'];',
      });
      expect(apiSpy).toHaveBeenCalledTimes(0);
    });

    test('Should delete wrong connection when error status code = 410', async () => {
      const ddbMock = { Items: [{ connectionId: { S: 'key' } }] };
      const ddbSpy: jest.SpyInstance = createAwsServicePromisableSpy(ddb, 'executeStatement', 'resolve', ddbMock);
      const ddbDeleteSpy: jest.SpyInstance = createAwsServicePromisableSpy(ddb, 'deleteItem', 'resolve');
      const apiSpy: jest.SpyInstance = createAwsServicePromisableSpy(api, 'postToConnection', 'reject', {
        statusCode: 410,
      });
      const data = { message: '123123' };
      await service.sendWSMessage(['123'], data);
      expect(ddbSpy).toHaveBeenCalledTimes(1);
      expect(ddbSpy).toHaveBeenCalledWith({
        Statement: 'SELECT "userId", "connectionId" FROM "string" WHERE "userId" IN [\'123\'];',
      });
      expect(apiSpy).toHaveBeenCalledTimes(ddbMock.Items.length);
      expect(apiSpy).toHaveBeenCalledWith({
        Data: JSON.stringify(data),
        ConnectionId: ddbMock.Items[0].connectionId.S,
      });
      expect(ddbDeleteSpy).toHaveBeenCalledTimes(1);
      expect(ddbDeleteSpy).toHaveBeenCalledWith({
        TableName: 'string',
        Key: { connectionId: ddbMock.Items[0].connectionId },
      });
    });

    test('Should not delete wrong connection when error status code != 410', async () => {
      const ddbMock = { Items: [{ connectionId: { S: 'key' } }] };
      const ddbSpy: jest.SpyInstance = createAwsServicePromisableSpy(ddb, 'executeStatement', 'resolve', ddbMock);
      const ddbDeleteSpy: jest.SpyInstance = createAwsServicePromisableSpy(ddb, 'deleteItem', 'resolve');
      const apiSpy: jest.SpyInstance = createAwsServicePromisableSpy(api, 'postToConnection', 'reject', {
        statusCode: 411,
      });
      const data = { message: '123123' };
      await service.sendWSMessage(['123'], data);
      expect(ddbSpy).toHaveBeenCalledTimes(1);
      expect(ddbSpy).toHaveBeenCalledWith({
        Statement: 'SELECT "userId", "connectionId" FROM "string" WHERE "userId" IN [\'123\'];',
      });
      expect(apiSpy).toHaveBeenCalledTimes(ddbMock.Items.length);
      expect(apiSpy).toHaveBeenCalledWith({
        Data: JSON.stringify(data),
        ConnectionId: ddbMock.Items[0].connectionId.S,
      });
      expect(ddbDeleteSpy).toHaveBeenCalledTimes(0);
    });
  });
});
