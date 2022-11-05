import { Test } from '@nestjs/testing';
import { HelperStringService } from '@src/modules/utils/helper/service/helper.string.service';

describe('HelperStringService', () => {
  let helperStringService: HelperStringService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ providers: [HelperStringService] }).compile();

    helperStringService = moduleRef.get<HelperStringService>(HelperStringService);
  });

  it('should be defined', () => {
    expect(helperStringService).toBeDefined();
  });

  describe('checkEmail', () => {
    it('should be called', () => {
      const test = jest.spyOn(helperStringService, 'checkEmail');

      helperStringService.checkEmail('111');
      expect(test).toHaveBeenCalledWith('111');
    });

    it('should be success', () => {
      const isEmail = helperStringService.checkEmail('111');
      jest.spyOn(helperStringService, 'checkEmail').mockImplementation(() => isEmail);

      expect(helperStringService.checkEmail('111')).toBe(isEmail);
    });
  });

  describe('randomReference', () => {
    it('should be called', () => {
      const test = jest.spyOn(helperStringService, 'randomReference');

      helperStringService.randomReference(10);
      expect(test).toHaveBeenCalledWith(10);
    });

    it('should be success', () => {
      const result = helperStringService.randomReference(10);
      jest.spyOn(helperStringService, 'randomReference').mockImplementation(() => result);

      expect(helperStringService.randomReference(10)).toBe(result);
    });
  });

  describe('random', () => {
    it('should be called', () => {
      const test = jest.spyOn(helperStringService, 'random');

      helperStringService.random(5);
      expect(test).toHaveBeenCalledWith(5);
    });

    it('should be success', () => {
      const result = helperStringService.random(5);
      jest.spyOn(helperStringService, 'random').mockImplementation(() => result);

      expect(helperStringService.random(5)).toBe(result);
    });
  });

  describe('censor', () => {
    it('should be called', () => {
      const test = jest.spyOn(helperStringService, 'censor');

      helperStringService.censor('12312312');
      expect(test).toHaveBeenCalledWith('12312312');
    });

    it('should be success', () => {
      const result = helperStringService.censor('12312312');
      jest.spyOn(helperStringService, 'censor').mockImplementation(() => result);

      expect(helperStringService.censor('12312312')).toBe(result);
    });
  });
});
