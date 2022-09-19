import { Injectable } from '@angular/core';
import {HttpclientService} from './httpclient.service'
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CouriersService {
  apiUrl:string;
  constructor(private http: HttpclientService) { 
    this.apiUrl = environment.apiUrl;
  }

  getAllCouriers(page = 1, status = undefined, phone = undefined, name = undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/couriers/list?${!status ? `page=${page}` : `page=${page}&status=${status}`}${name ? `&name=${name}` : ""}${phone ? `&phone=${phone}` : ""}` )
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  getCourierByID(id) {
    return this.http.getWithAuth(`${this.apiUrl}/couriers/${id}` )
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  changeStatus(id, status): Observable<any> {
    return this.http.putWithAuth(`${this.apiUrl}/couriers/change-status/${id}`,{status:status})
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  delete(id) : Observable<any>{
    return this.http.deleteWithAuth(`${this.apiUrl}/couriers/delete/${id}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)));
  } 

  update(id, data) : Observable<any> {
    return this.http.putWithAuth(`${this.apiUrl}/couriers/update/${id}`,data)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  create(data): Observable<any> {
    return this.http.postWithAuth(`${this.apiUrl}/couriers/create`, data)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  countTotal(country= undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/couriers/countTotal${country ? `?country=${country}` : ``}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  countActive(country= undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/couriers/countActive${country ? `?country=${country}` : ``}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  countInactive(country= undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/couriers/countInactive${country ? `?country=${country}` : ``}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  exportCouriers(page = 1, status = undefined, phone = undefined, name = undefined): Observable<any> {
    return this.http.postFileWithAuth(`${this.apiUrl}/couriers/export-list?${!status ? `page=${page}` : `page=${page}&status=${status}`}${name ? `&name=${name}` : ""}${phone ? `&phone=${phone}` : ""}`, {})
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

}
