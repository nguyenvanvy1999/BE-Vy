import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { EFileType } from '@src/modules/utils/file/file.constant';
import { FileImageInterceptor } from '@src/modules/utils/file/interceptor/file.image.interceptor';

export function UploadFileSingle(field: string, type: EFileType, required?: boolean): any {
  if (type === EFileType.IMAGE) {
    return applyDecorators(UseInterceptors(FileInterceptor(field), FileImageInterceptor(required)));
  }

  return applyDecorators(UseInterceptors(FileInterceptor(field)));
}

export function UploadFileMultiple(field: string, type: EFileType, required?: boolean): any {
  if (type === EFileType.IMAGE) {
    return applyDecorators(UseInterceptors(FilesInterceptor(field), FileImageInterceptor(required)));
  }

  return applyDecorators(UseInterceptors(FilesInterceptor(field)));
}
