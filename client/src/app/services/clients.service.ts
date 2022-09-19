import { Injectable } from '@angular/core';
import {HttpclientService} from './httpclient.service'
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  apiUrl: string;
  constructor(private http: HttpclientService) {
    this.apiUrl = environment.apiUrl;
  }

  getAllClients(page = 1, status=undefined, phone=undefined, name=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/clients/list?${!status ? `page=${page}` : `page=${page}&status=${status}`}${name ? `&name=${name}` : ""}${phone ? `&phone=${phone}` : ""}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  changeStatus(id, status) {
    return this.http.putWithAuth(`${this.apiUrl}/clients/change-status/${id}`, {status: status})
      .pipe(map((res:any) => {
        return res;
      }),catchError(err => throwError(err)))
  }

  delete(id) {
    return this.http.deleteWithAuth(`${this.apiUrl}/clients/delete/${id}`)
      .pipe(map((res:any) => {
        return res;
      }),catchError(err => throwError(err)))
  }

  countTotal(country = undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/clients/countTotal${country ? `?country=${country}` : ``}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  countActive(country = undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/clients/countActive${country ? `?country=${country}` : ``}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  countInactive(country = undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/clients/countInactive${country ? `?country=${country}` : ``}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  exportClients(page = 1, status = undefined, phone = undefined, name = undefined): Observable<any> {
    return this.http.postFileWithAuth(`${this.apiUrl}/clients/export-list?${!status ? `page=${page}` : `page=${page}&status=${status}`}${name ? `&name=${name}` : ""}${phone ? `&phone=${phone}` : ""}`, {})
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  getAll(): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/clients/all`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }
}
