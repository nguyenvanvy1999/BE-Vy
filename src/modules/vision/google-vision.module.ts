import { Module } from '@nestjs/common';
import { GoogleVisionService } from './google-vision.service';

@Module({
  imports: [],
  providers: [GoogleVisionService],
  exports: [GoogleVisionService],
})
export class GoogleVisionModule {}
