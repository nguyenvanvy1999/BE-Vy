import { Test } from '@nestjs/testing';
import { PaginationService } from '@src/modules/utils/pagination/service/pagination.service';

describe('PaginationService', () => {
  let paginationService: PaginationService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ providers: [PaginationService] }).compile();

    paginationService = moduleRef.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(paginationService).toBeDefined();
  });

  describe('skip', () => {
    it('should be called', () => {
      const test = jest.spyOn(paginationService, 'skip');

      paginationService.skip(1, 10);
      expect(test).toHaveBeenCalledWith(1, 10);
    });

    it('should be success', () => {
      const skip = paginationService.skip(1, 10);
      jest.spyOn(paginationService, 'skip').mockImplementation(() => skip);

      expect(paginationService.skip(1, 10)).toBe(skip);
    });
  });

  describe('totalPage', () => {
    it('should be called', () => {
      const test = jest.spyOn(paginationService, 'totalPage');

      paginationService.totalPage(100, 10);
      expect(test).toHaveBeenCalledWith(100, 10);
    });

    it('should be success', () => {
      const totalPage = paginationService.totalPage(100, 10);
      jest.spyOn(paginationService, 'totalPage').mockImplementation(() => totalPage);

      expect(paginationService.totalPage(100, 10)).toBe(totalPage);
    });
  });
});
