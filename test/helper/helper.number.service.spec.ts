import { Test } from '@nestjs/testing';
import { HelperNumberService } from '@src/modules/utils/helper/service/helper.number.service';

describe('HelperNumberService', () => {
  let helperNumberService: HelperNumberService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [HelperNumberService],
    }).compile();

    helperNumberService =
      moduleRef.get<HelperNumberService>(HelperNumberService);
  });

  it('should be defined', () => {
    expect(helperNumberService).toBeDefined();
  });

  describe('check', () => {
    it('should be called', () => {
      const test = jest.spyOn(helperNumberService, 'check');

      helperNumberService.check('111');
      expect(test).toHaveBeenCalledWith('111');
    });

    it('should be success', () => {
      const isCheck = helperNumberService.check('111');
      jest
        .spyOn(helperNumberService, 'check')
        .mockImplementation(() => isCheck);

      expect(helperNumberService.check('111')).toBe(isCheck);
    });
  });

  describe('random', () => {
    it('should be called', () => {
      const test = jest.spyOn(helperNumberService, 'random');

      helperNumberService.random(10);
      expect(test).toHaveBeenCalledWith(10);
    });

    it('should be success', () => {
      const result = helperNumberService.random(10);
      jest
        .spyOn(helperNumberService, 'random')
        .mockImplementation(() => result);

      expect(helperNumberService.random(10)).toBe(result);
    });
  });

  describe('randomInRange', () => {
    it('should be called', () => {
      const test = jest.spyOn(helperNumberService, 'randomInRange');

      helperNumberService.randomInRange(5, 8);
      expect(test).toHaveBeenCalledWith(5, 8);
    });

    it('should be success', () => {
      const result = helperNumberService.randomInRange(5, 8);
      jest
        .spyOn(helperNumberService, 'randomInRange')
        .mockImplementation(() => result);

      expect(helperNumberService.randomInRange(5, 8)).toBe(result);
    });
  });
});
