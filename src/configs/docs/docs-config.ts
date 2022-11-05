import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import type { AsyncServerObject } from 'nestjs-asyncapi';
import { AsyncApiDocumentBuilder } from 'nestjs-asyncapi';
import type { RedocOptions } from 'nestjs-redoc';
import path from 'path';
import { EDocsType } from '@src/configs/docs/docs.interface';

export function buildSwaggerConfig(type: EDocsType): Omit<OpenAPIObject, 'paths'> {
  const version = '0.0.1';
  const contact = {
    name: 'Nguyen Van Vy',
    url: 'https://github.com/nguyenvanvy1999',
    email: 'nguyenvanvy1999@gmail.com',
  };
  const license = {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT',
  };
  switch (type) {
    case EDocsType.COMMON:
    case EDocsType.ADMIN:
      return new DocumentBuilder()
        .addBearerAuth({
          type: 'http',
          in: 'headers',
          description: 'Auth for user auth',
          name: 'user',
        })
        .setTitle(type === EDocsType.ADMIN ? 'Mesh Admin APIs' : 'Mesh Common APIs')
        .setContact(contact.name, contact.url, contact.email)
        .setDescription(type === EDocsType.ADMIN ? 'Mesh Admin APIs' : 'Mesh Common APIs')
        .setVersion(version)
        .setLicense(license.name, license.url)
        .build();

    case EDocsType.DEVICE:
      return new DocumentBuilder()
        .addBearerAuth({
          type: 'http',
          in: 'headers',
          description: 'Auth for device auth',
          name: 'device',
        })
        .setTitle('Mesh Device APIs')
        .setContact(contact.name, contact.url, contact.email)
        .setDescription('Mesh Device APIs')
        .setVersion(version)
        .setLicense(license.name, license.url)
        .build();

    case EDocsType.WEBHOOK:
    case EDocsType.PUBLIC:
      return new DocumentBuilder()
        .setTitle(type === EDocsType.WEBHOOK ? 'Mesh Webhook APIs' : 'Mesh Public APIs')
        .setContact(contact.name, contact.url, contact.email)
        .setDescription(type === EDocsType.WEBHOOK ? 'Mesh Webhook APIs' : 'Mesh Public APIs')
        .setVersion(version)
        .setLicense(license.name, license.url)
        .build();
  }
}

export const buildRedocOptions = (
  type: EDocsType,
  enabled: boolean,
  user?: string,
  password?: string,
): RedocOptions => {
  if (enabled && !user && !password) {
    throw new Error('Redoc config wrong. User and password required');
  }
  let tagGroups = [];
  let title: string = '';
  switch (type) {
    case EDocsType.WEBHOOK:
      tagGroups = [];
      title = 'Mesh Webhook APIs';
      break;

    case EDocsType.ADMIN:
      tagGroups = [
        { name: 'User', tags: ['User Admin APIs', 'Role Admin APIs'] },
        { name: 'Setting', tags: ['Setting Admin APIs'] },
      ];
      title = 'Mesh Admin APIs';
      break;
    case EDocsType.COMMON:
      tagGroups = [];
      title = 'Mesh Common APIs';
      break;
    case EDocsType.DEVICE:
      tagGroups = [{ name: 'Device', tags: ['Device Common APIs'] }];
      title = 'Mesh Device APIs';
      break;
    case EDocsType.PUBLIC:
      tagGroups = [
        { name: 'Health', tags: ['Health Public APIs'] },
        {
          name: 'Public',
          tags: ['Default APIs', 'Message Public APIs', 'Metric Public APIs'],
        },
      ];
      title = 'Mesh Public APIs';
      break;
  }

  return {
    favicon: path.join(__dirname, '../public/favicon.ico'),
    title,
    logo: {
      url: 'https://redocly.github.io/redoc/petstore-logo.png',
      backgroundColor: '#F0F0F0',
      altText: 'Mesh logo',
    },
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
    auth: { enabled, user, password },
    tagGroups,
  };
};

const asyncApiServer: AsyncServerObject = {
  url: 'ws://localhost:8000',
  protocol: 'socket.io',
  protocolVersion: '4',
  description: 'Allows you to connect using the websocket protocol to our Socket.io server.',
  security: [{ 'user-password': [] }],
  variables: {
    port: {
      description: 'Secure connection (TLS) is available through port 443.',
      default: '5000',
    },
  },
  bindings: {},
};

export const asyncApiConfig = new AsyncApiDocumentBuilder()
  .setTitle('SocketIO')
  .setDescription('SocketIO')
  .setVersion('0.0.1')
  .setDefaultContentType('application/json')
  .addSecurity('user-password', { type: 'userPassword' })
  .addServer('room-server', asyncApiServer)
  .build();
