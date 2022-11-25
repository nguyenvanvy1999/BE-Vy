import { Get } from '@nestjs/common';
import { TranslateService } from '@src/modules/translate';
import { ListLanguageResDTO } from '@src/modules/translate/dtos';
import { HttpApiError } from '@src/modules/utils/error/error.decorator';
import { HttpControllerInit } from '@src/modules/utils/init';
import { HttpApiRequest } from '@src/modules/utils/request/request.decorator';
import { HttpApiResponse } from '@src/modules/utils/response/response.decorator';
import { IResponse } from '@src/modules/utils/response/response.interface';

@HttpControllerInit('Translate Public APIs', 'translate', '1')
export class TranslatePublicController {
  constructor(private readonly messageService: TranslateService) {}

  @HttpApiRequest('Get list of languages')
  @HttpApiResponse('message.enum.languages', ListLanguageResDTO)
  @HttpApiError()
  @Get('/languages')
  languages(): IResponse {
    const languages: string[] = this.messageService.getLanguages();

    return {
      languages,
    };
  }
}
