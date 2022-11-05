import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { configModuleSetup } from '@src/configs/env/env.provider';
import { DebuggerOptionService } from '@src/modules/debugger/services/debugger.option.service';

describe('DebuggerOptionService', () => {
  let debuggerOptionService: DebuggerOptionService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(configModuleSetup)],
      providers: [ConfigService, DebuggerOptionService],
    }).compile();

    debuggerOptionService = moduleRef.get<DebuggerOptionService>(DebuggerOptionService);
  });

  it('should be defined', () => {
    expect(debuggerOptionService).toBeDefined();
  });

  describe('info', () => {
    it('should be called', () => {
      const test = jest.spyOn(debuggerOptionService, 'createLogger');

      debuggerOptionService.createLogger();
      expect(test).toHaveBeenCalled();
    });

    it('should be success', () => {
      const options = debuggerOptionService.createLogger();
      jest.spyOn(debuggerOptionService, 'createLogger').mockImplementation(() => options);

      expect(debuggerOptionService.createLogger()).toBe(options);
    });
  });
});
