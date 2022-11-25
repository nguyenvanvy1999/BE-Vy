import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { HealthService } from '@src/modules/health/health.service';

describe('HealthService', () => {
  let module: TestingModule;
  let service: HealthService;
  const healthCheckServiceMock = {
    check: jest.fn(),
  };
  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        HealthService,
        HealthCheckService,
        {
          provide: HealthCheckService,
          useValue: healthCheckServiceMock,
        },
        {
          provide: HttpHealthIndicator,
          useValue: { pingCheck: jest.fn() },
        },
      ],
    }).compile();
    service = module.get<HealthService>(HealthService);
  });

  describe('HealthService define', () => {
    it('Should be defined', () => {
      expect(service).toBeDefined();
    });
  });
});
