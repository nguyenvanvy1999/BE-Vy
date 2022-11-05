import { Get } from '@nestjs/common';
import { MessageService } from '@src/modules/message';
import { ListLanguageResDTO } from '@src/modules/message/dtos';
import { HttpApiError } from '@src/modules/utils/error/error.decorator';
import { HttpControllerInit } from '@src/modules/utils/init';
import { HttpApiRequest } from '@src/modules/utils/request/request.decorator';
import { HttpApiResponse } from '@src/modules/utils/response/response.decorator';
import { IResponse } from '@src/modules/utils/response/response.interface';

@HttpControllerInit('Message Public APIs', 'message', '1')
export class MessagePublicController {
  constructor(private readonly messageService: MessageService) {}

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
