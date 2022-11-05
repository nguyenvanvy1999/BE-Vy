import type { HealthCheckResult } from '@nestjs/terminus';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { HealthService } from '@src/modules/health/health.service';
import { PrometheusService } from '@src/modules/prometheus/prometheus.service';

describe('HealthService', () => {
  let module: TestingModule;
  let service: HealthService;
  const healthCheckServiceMock = {
    check: jest.fn(),
  };
  const healthCheckSuccess: HealthCheckResult = { status: 'ok', details: {} };
  const healthCheckError: HealthCheckResult = { status: 'error', details: {} };
  const healthCheckShuttingDown: HealthCheckResult = { status: 'shutting_down', details: {} };
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
          provide: PrometheusService,
          useValue: {
            registerMetrics: jest.fn().mockReturnValue({ startTimer: () => '' }),
            registerGauges: jest.fn().mockReturnValue(''),
            registerGauge: jest.fn().mockReturnValue(''),
          },
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

  describe('Should return HealthCheckResult', () => {
    test('Health check success', async () => {
      healthCheckServiceMock.check.mockReturnValue(healthCheckSuccess);
      const res = await service.check();
      expect(res).toStrictEqual(healthCheckSuccess);
      expect(res.status).toStrictEqual(healthCheckSuccess.status);
      expect(res.details).toStrictEqual(healthCheckSuccess.details);
    });

    test('Health check error', async () => {
      healthCheckServiceMock.check.mockReturnValue(healthCheckError);
      const res = await service.check();
      expect(res).toStrictEqual(healthCheckError);
      expect(res.status).toStrictEqual(healthCheckError.status);
      expect(res.details).toStrictEqual(healthCheckError.details);
    });

    test('Health check shutting down', async () => {
      healthCheckServiceMock.check.mockReturnValue(healthCheckShuttingDown);
      const res = await service.check();
      expect(res).toStrictEqual(healthCheckShuttingDown);
      expect(res.status).toStrictEqual(healthCheckShuttingDown.status);
      expect(res.details).toStrictEqual(healthCheckShuttingDown.details);
    });

    test('Should return undefined when no heal check', async () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      healthCheckServiceMock.check.mockReturnValue(undefined);
      const res = await service.check();
      expect(res).not.toBeDefined();
    });
  });
});
