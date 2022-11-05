/* eslint-disable unicorn/prefer-spread */
import { Injectable } from '@nestjs/common';
import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WSService {
  constructor(
    @InjectAwsService(DynamoDB) private readonly ddb: DynamoDB,
    @InjectAwsService(ApiGatewayManagementApi) private readonly api: ApiGatewayManagementApi,
    private readonly config: ConfigService,
  ) {}

  private static queryString(tableName: string, userIds: string[]): string {
    let statement = `SELECT "userId", "connectionId" FROM "${tableName}" WHERE "userId" IN [`;

    for (const x of userIds) {
      statement = statement.concat(`'${x}',`);
    }

    statement = statement.slice(0, -1);

    statement = statement.concat('];');

    return statement;
  }

  public async sendWSMessage(userIds: string[], data: unknown): Promise<void> {
    try {
      const tableName = this.config.get<string>('aws.dynamodb.name');

      const connections = await this.ddb
        .executeStatement({ Statement: WSService.queryString(tableName, userIds) })
        .promise();
      await Promise.all(
        connections.Items.map(async (connect) => {
          try {
            await this.api
              .postToConnection({ Data: JSON.stringify(data), ConnectionId: connect.connectionId.S })
              .promise();
          } catch (error) {
            if (error.statusCode === 410) {
              await this.ddb
                .deleteItem({ TableName: tableName, Key: { connectionId: connect.connectionId } })
                .promise();
            }
          }
        }),
      );

      return;
    } catch (error) {
      throw new Error(error);
    }
  }
}
