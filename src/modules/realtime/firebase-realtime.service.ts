import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DOOR_STATUS } from './door-status.enum';

@Injectable()
export class FirebaseRealtimeService {
  public controlInDoor(status: DOOR_STATUS): DOOR_STATUS {
    const db = admin.database();
    const ref = db.ref('control_in');
    ref.set(status);
    return status;
  }

  public controlOutDoor(status: DOOR_STATUS): DOOR_STATUS {
    const db = admin.database();
    const ref = db.ref('control_out');
    ref.set(status);
    return status;
  }
}
