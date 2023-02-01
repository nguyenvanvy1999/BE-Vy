import { Module } from '@nestjs/common';
import { FirebaseRealtimeService } from './firebase-realtime.service';

@Module({
  imports: [],
  providers: [FirebaseRealtimeService],
  exports: [FirebaseRealtimeService],
})
export class FirebaseRealtimeModule {}
