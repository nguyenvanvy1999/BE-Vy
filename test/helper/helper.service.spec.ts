import { Test } from '@nestjs/testing';
import { HelperService } from '@src/modules/utils/helper/service/helper.service';

describe('HelperService', () => {
  let helperService: HelperService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [HelperService],
    }).compile();

    helperService = moduleRef.get<HelperService>(HelperService);
  });

  it('should be defined', () => {
    expect(helperService).toBeDefined();
  });

  describe('check', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperService, 'delay');

      await helperService.delay(100);
      expect(test).toHaveBeenCalledWith(100);
    });

    it('should be success', async () => {
      const result = await helperService.delay(100);
      jest
        .spyOn(helperService, 'delay')
        .mockImplementation(() => Promise.resolve(result));

      expect(await helperService.delay(100)).toBe(result);
    });
  });
});
