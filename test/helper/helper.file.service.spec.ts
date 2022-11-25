import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { HelperFileService } from '@src/modules/utils/helper/service/helper.file.service';

describe('HelperFileService', () => {
  let helperFileService: HelperFileService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [HelperFileService, ConfigService],
    }).compile();

    helperFileService = moduleRef.get<HelperFileService>(HelperFileService);
  });

  it('should be defined', () => {
    expect(helperFileService).toBeDefined();
  });

  describe('writeExcel', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperFileService, 'writeExcel');

      await helperFileService.writeExcel([], []);
      expect(test).toHaveBeenCalledWith([], []);
    });

    it('should be success', () => {
      const result = helperFileService.writeExcel([], []);
      jest
        .spyOn(helperFileService, 'writeExcel')
        .mockImplementation(() => result);

      expect(helperFileService.writeExcel([], [])).toBe(result);
    });
  });
});
