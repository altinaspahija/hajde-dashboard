import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';



@Injectable({
  providedIn: 'root'
})
export class SocketService {


  public notification$: BehaviorSubject<any> = new BehaviorSubject('');
  constructor(private socket: Socket) {
 
   }

   public notificationObservable(): Observable<any> {
     return new Observable<any>((obs) => {
        this.socket.on('notification', (data) => {
          obs.next(data);
        })
     });
   }

}
