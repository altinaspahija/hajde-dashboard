import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import {HttpclientService} from './httpclient.service';

@Injectable({
  providedIn: 'root'
})
export class ImporterService {
  apiUrl: string;
  constructor(private http: HttpclientService) {
    this.apiUrl = environment.apiUrl;
  }

  save(data) {
    return this.http.postWithAuth(`${this.apiUrl}/importer/save`, data)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  saveWithId(id, data) {
    return this.http.postWithAuth(`${this.apiUrl}/importer/save/${id}`, data)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }


  get() {
    return this.http.getWithAuth(`${this.apiUrl}/importer`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  getWithId(id) {
    return this.http.getWithAuth(`${this.apiUrl}/importer/${id}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }
}
