import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AppService } from '@src/modules/app/app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('AppService define', () => {
    it('should be define', () => {
      expect(service).toBeDefined();
    });
  });

  describe('AppService getHello', () => {
    it('should be define', () => {
      expect(service.getHello()).toBe('Hello World!');
    });
  });
});
