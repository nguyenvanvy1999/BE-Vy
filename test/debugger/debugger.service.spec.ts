import { Test } from '@nestjs/testing';
import { DebuggerService } from '@src/modules/debugger/services/debugger.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('DebuggerService', () => {
  let debuggerService: DebuggerService;

  const sDescription = 'test description';
  const sClass = 'test class';
  const cFunction = 'test function';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DebuggerService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn(), info: jest.fn() },
        },
      ],
    }).compile();

    debuggerService = moduleRef.get<DebuggerService>(DebuggerService);
  });

  it('should be defined', () => {
    expect(debuggerService).toBeDefined();
  });

  describe('info', () => {
    it('should be called', () => {
      const test = jest.spyOn(debuggerService, 'info');

      debuggerService.info(sDescription, sClass, cFunction);
      expect(test).toHaveBeenCalledWith(sDescription, sClass, cFunction);
    });
  });

  describe('debug', () => {
    it('should be called', () => {
      const test = jest.spyOn(debuggerService, 'debug');

      debuggerService.debug(sDescription, sClass, cFunction);
      expect(test).toHaveBeenCalledWith(sDescription, sClass, cFunction);
    });
  });

  describe('error', () => {
    it('should be called', () => {
      const test = jest.spyOn(debuggerService, 'error');

      debuggerService.error(sDescription, sClass, cFunction);
      expect(test).toHaveBeenCalledWith(sDescription, sClass, cFunction);
    });
  });
});
