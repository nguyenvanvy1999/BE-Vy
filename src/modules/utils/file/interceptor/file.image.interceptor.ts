import type { CallHandler, ExecutionContext, NestInterceptor, Type } from '@nestjs/common';
import {
  Injectable,
  mixin,
  PayloadTooLargeException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { EFileImageMime, EFileStatusCodeError } from '@src/modules/utils/file/file.constant';
import type { IFile } from '@src/modules/utils/file/file.interface';
import type { Observable } from 'rxjs';

export function FileImageInterceptor(required?: boolean): Type<NestInterceptor> {
  @Injectable()
  class MixinFileImageInterceptor implements NestInterceptor<Promise<any>> {
    constructor(private readonly configService: ConfigService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<Promise<any> | string> {
      const ctx: HttpArgumentsHost = context.switchToHttp();
      const { file, files } = ctx.getRequest();

      const finalFiles = files || file;

      if (Array.isArray(finalFiles)) {
        const maxFiles = this.configService.get<number>('file.maxFiles');

        if (required && finalFiles.length === 0) {
          throw new UnprocessableEntityException({
            statusCode: EFileStatusCodeError.FILE_NEEDED_ERROR,
            message: 'file.error.notFound',
          });
        } else if (finalFiles.length > maxFiles) {
          throw new UnprocessableEntityException({
            statusCode: EFileStatusCodeError.FILE_MAX_ERROR,
            message: 'file.error.maxFiles',
          });
        }

        for (const f of finalFiles) {
          this.validate(f);
        }
      } else {
        this.validate(finalFiles);
      }

      return next.handle();
    }

    validate(file: IFile): void {
      if (required && !file) {
        throw new UnprocessableEntityException({
          statusCode: EFileStatusCodeError.FILE_NEEDED_ERROR,
          message: 'file.error.notFound',
        });
      } else if (file) {
        const { size, mimetype } = file;

        const maxSize = this.configService.get<number>('file.maxFileSize');

        if (!Object.values(EFileImageMime).some((val) => val === mimetype.toLowerCase())) {
          throw new UnsupportedMediaTypeException({
            statusCode: EFileStatusCodeError.FILE_EXTENSION_ERROR,
            message: 'file.error.mimeInvalid',
          });
        } else if (size > maxSize) {
          throw new PayloadTooLargeException({
            statusCode: EFileStatusCodeError.FILE_MAX_SIZE_ERROR,
            message: 'file.error.maxSize',
          });
        }
      }
    }
  }

  return mixin(MixinFileImageInterceptor);
}
