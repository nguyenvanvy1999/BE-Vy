import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DOOR_STATUS } from './door-status.enum';
import { DOOR } from './door.enum';

@Injectable()
export class FirebaseRealtimeService {
  public controlDoor(body: { status: DOOR_STATUS; door: DOOR }): DOOR_STATUS {
    const db = admin.database();
    const ref = db.ref(`control_${body.door}`);
    ref.set(body.status);
    return body.status;
  }

  public async getDoorStatus(door: DOOR): Promise<DOOR_STATUS> {
    const db = admin.database();
    const ref = db.ref(`control_${door}`);
    const data = await ref.get();
    return data.val();
  }
}
