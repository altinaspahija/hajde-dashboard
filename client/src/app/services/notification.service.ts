import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpclientService } from './httpclient.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  apiUrl: string;
  socketUrl: string;

  constructor(private http: HttpclientService) {
    this.apiUrl = environment.apiUrl;
    this.socketUrl = environment.socketUrl;
  }

  sendNotification(body: any) {
    return this.http.postWithAuth(`${this.socketUrl}/api/notifications/send-notification`, body)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)));
  }

  downloadList(body: any) {
    const queryObj = {};
    if (body.country) {
      queryObj["country"] = body.country;
    }
    if (body.targetGroup) {
      queryObj["targetGroup"] = body.targetGroup;
    }
    
    const params = new URLSearchParams(queryObj);

    return this.http.getFileWithAuth(`${this.socketUrl}/api/notifications/get-notification-user-list?${params.toString()}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)));
  }

  getAdminNotification() {
    return this.http.getWithAuth(`${this.apiUrl}/notifications/list`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)));
  }

  setSeen(id) {
    return this.http.putWithAuth(`${this.apiUrl}/notifications/set-seen/${id}`, {})
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)));

  }

  getAdminCount() {
    return this.http.getWithAuth(`${this.apiUrl}/notifications/count`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)));
  }
  
}
