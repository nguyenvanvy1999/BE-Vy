import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { configModuleSetup } from '@src/configs/env/env.provider';
import type { IJwtPayload } from '@src/modules/auth/interfaces';
import { JwtStrategy } from '@src/modules/auth/strategies';
import { DeviceService } from '@src/modules/device/services';

describe('JwtStrategy', () => {
  let module: TestingModule;
  let service: JwtStrategy;
  let mockDeviceService: DeviceService;
  const device = {
    _id: '6273d86eab7290884534636d',
    deviceName: 'Camera01',
    deviceType: 'Camera',
    SN: '123',
    deviceMAC: '6f:f7:4c:d6:5d:40',
  };
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(configModuleSetup)],
      providers: [
        ConfigService,
        JwtStrategy,
        {
          provide: DeviceService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(device),
          },
        },
      ],
    }).compile();
    service = module.get<JwtStrategy>(JwtStrategy);
    mockDeviceService = module.get<DeviceService>(DeviceService);
  });

  describe('JwtStrategy define', () => {
    it('Should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('JwtStrategy validate', () => {
    test('Should return payload when device found!', async () => {
      const payload: IJwtPayload = {
        sub: '1234567890',
        _id: '6273d86eab7290884534636d',
        deviceName: 'Camera01',
        iat: 1_516_239_022,
      };
      const res = await service.validate(payload);
      expect(res).toBe(device);
    });

    test('Should throw error when no device found', async () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      jest.spyOn(mockDeviceService, 'findOne').mockResolvedValue(undefined);
      await expect(
        service.validate({
          sub: '1234567890',
          _id: '6273d86eab7290884534636d',
          deviceName: 'Camera01',
          iat: 1_516_239_022,
        }),
      ).rejects.toThrowError(new UnauthorizedException('Device not found!'));
    });

    test('Should throw error when no _id', async () => {
      await expect(
        service.validate({
          sub: '1234567890',
          _id: undefined,
          deviceName: 'Camera01',
          iat: 1_516_239_022,
        }),
      ).rejects.toThrowError(new UnauthorizedException('Wrong token!'));
    });
  });
});
