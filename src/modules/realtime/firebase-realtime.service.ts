import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DOOR_STATUS } from './door-status.enum';

@Injectable()
export class FirebaseRealtimeService {
  public async controlInDoor(status: DOOR_STATUS): Promise<DOOR_STATUS> {
    const db = admin.database();
    const ref = db.ref('control_in');
    ref.set(status);
    ref.once('value', function (snapshot) {
      console.log(snapshot.val());
    });
    return status;
  }

  public async controlOutDoor(status: DOOR_STATUS): Promise<DOOR_STATUS> {
    const db = admin.database();
    const ref = db.ref('control_out');
    ref.set(status);
    ref.once('value', function (snapshot) {
      console.log(snapshot.val());
    });
    return status;
  }
}
