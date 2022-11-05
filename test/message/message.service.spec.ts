import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { configModuleSetup } from '@src/configs/env/env.provider';
import { MessageModule, MessageService } from '@src/modules/message';

describe('MessageService', () => {
  let messageService: MessageService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MessageModule, ConfigModule.forRoot(configModuleSetup)],
    }).compile();

    messageService = moduleRef.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(messageService).toBeDefined();
  });

  describe('get', () => {
    it('should be called', () => {
      const test = jest.spyOn(messageService, 'get');

      messageService.get('test.hello');
      expect(test).toHaveBeenCalledWith('test.hello');
    });

    it('should be success', () => {
      const message = messageService.get('test.hello');
      jest.spyOn(messageService, 'get').mockImplementation(() => message);

      expect(messageService.get('test.hello')).toBe(message);
    });
  });

  describe('getRequestErrorsMessage', () => {
    const validationError = [
      {
        target: {
          email: 'adminmail.com',
          password: 'aaAA@@123444',
          rememberMe: true,
        },
        value: 'adminmail.com',
        property: 'email',
        children: [],
        constraints: { isEmail: 'email must be an email' },
      },
    ];

    it('should be called', () => {
      const test = jest.spyOn(messageService, 'getRequestErrorsMessage');

      messageService.getRequestErrorsMessage(validationError);
      expect(test).toHaveBeenCalledWith(validationError);
    });

    it('should be success', () => {
      const message = messageService.getRequestErrorsMessage(validationError);
      jest.spyOn(messageService, 'getRequestErrorsMessage').mockImplementation(() => message);

      expect(messageService.getRequestErrorsMessage(validationError)).toBe(message);
    });
  });

  describe('getLanguages', () => {
    it('should be called', () => {
      const test = jest.spyOn(messageService, 'getLanguages');

      messageService.getLanguages();
      expect(test).toHaveBeenCalled();
    });

    it('should be success', () => {
      const languages = messageService.getLanguages();
      jest.spyOn(messageService, 'getLanguages').mockImplementation(() => languages);

      expect(messageService.getLanguages()).toBe(languages);
    });
  });
});
