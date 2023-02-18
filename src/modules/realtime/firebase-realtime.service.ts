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

  public async checkCloseDoorCondition(door: DOOR): Promise<void> {
    const db = admin.database()
    while (true) {
      const [distance1, distance2] = await Promise.all([db.ref(`${door}_distance_1`).get(), db.ref(`${door}_distance_2`).get()])
      if (distance1.val() > 4 && distance2.val() < 4) {
        break
      }
    }
    return
  }
}
