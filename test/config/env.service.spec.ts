import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { CustomConfigService } from '@src/configs/env';

describe('CustomConfigService', () => {
  let service: CustomConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomConfigService],
    }).compile();
    service = module.get<CustomConfigService>(CustomConfigService);
    process.env.NUMBER = '3000';
    process.env.WRONG_NUMBER = 'string';
    process.env.STRING = 'string';
    process.env.BOOLEAN = 'true';
    process.env.WRONG_BOOLEAN = '{const:123}';
  });

  describe('CustomConfigService define', () => {
    it('Success: should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('CustomConfigService getString', () => {
    test('Success: Should return value of key in .env file and value is a string', () => {
      const res = service.getString('STRING', { throwError: true });
      expect(res).toBeDefined();
      expect(res).toBe(process.env.STRING);
      expect(typeof res).toBe('string');
    });

    test('Success: Should return defaultValue if not found value of key and pass defaultValue', () => {
      const defaultValue = 'defaultValue';
      const res = service.getString('NONE', { defaultValue });
      expect(res).toBeDefined();
      expect(res).toBe(defaultValue);
      expect(typeof res).toBe('string');
    });

    test('Error: Should throw default error when throwError is true', () => {
      const key = 'WRONG_KEY';
      expect(() => service.getString(key, { throwError: true })).toThrowError(
        new ReferenceError(`${key} required`),
      );
    });

    test('Error: Should throw custom error when throwError is a error', () => {
      const error = new Error('Error');
      expect(() =>
        service.getString('NONE', { throwError: error }),
      ).toThrowError(error);
    });
  });

  describe('CustomConfigService getNumber', () => {
    test('Success: Should return value of key in .env file and value is a number', () => {
      const res = service.getNumber('NUMBER', { throwError: true });
      expect(res).toBeDefined();
      expect(res).toBe(Number(process.env.NUMBER));
      expect(typeof res).toBe('number');
    });

    test('Success: Should return defaultValue if not found value of key and pass defaultValue', () => {
      const defaultValue = 1230;
      const res = service.getNumber('NONE', { defaultValue });
      expect(res).toBeDefined();
      expect(res).toBe(defaultValue);
      expect(typeof res).toBe('number');
    });

    test('Error: Should throw default error when throwError is true', () => {
      const key = 'WRONG_KEY';
      expect(() => service.getNumber(key, { throwError: true })).toThrowError(
        new ReferenceError(`${key} required`),
      );
    });

    test('Error: Should throw error when throwError is a error', () => {
      const error = new Error('Error');
      expect(() =>
        service.getNumber('NONE', { throwError: error }),
      ).toThrowError(error);
    });

    test('Error: Should throw error when value of key not a number', () => {
      const key = 'WRONG_NUMBER';
      expect(() => service.getNumber(key, { throwError: true })).toThrowError(
        new TypeError(`${key} env var is not a number`),
      );
    });
  });

  describe('CustomConfigService getBoolean', () => {
    test('Success: Should return value of key in .env file and value is a boolean', () => {
      const shouldBoolean = service.getBoolean('BOOLEAN', { throwError: true });
      expect(shouldBoolean).toBeDefined();
      expect(shouldBoolean).toBe(Boolean(process.env.BOOLEAN));
      expect(typeof shouldBoolean).toBe('boolean');
    });

    test('Success: Should return defaultValue if not found value of key and pass defaultValue', () => {
      const hasBoolean = false;
      const shouldBoolean = service.getBoolean('NONE', {
        defaultValue: hasBoolean,
      });
      expect(shouldBoolean).toBeDefined();
      expect(shouldBoolean).toBe(hasBoolean);
      expect(typeof shouldBoolean).toBe('boolean');
    });

    test('Error: Should throw default error when throwError is true', () => {
      const key = 'WRONG_KEY';
      expect(() => service.getBoolean(key, { throwError: true })).toThrowError(
        new ReferenceError(`${key} required`),
      );
    });

    test('Error: Should throw error when throwError is a error', () => {
      const error = new Error('Error');
      expect(() =>
        service.getBoolean('NONE', { throwError: error }),
      ).toThrowError(error);
    });

    test('Error: Should throw error when value of key not a boolean', () => {
      const key = 'WRONG_BOOLEAN';
      expect(() => service.getBoolean(key, { throwError: true })).toThrowError(
        new TypeError(`${key} env var is not a boolean`),
      );
    });
  });
});
