import { Injectable } from '@angular/core';
import {HttpclientService} from './httpclient.service'
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  apiUrl: string;

  constructor(private http: HttpclientService) { 
    this.apiUrl = environment.apiUrl;
  }

  getAllRestaurants(page: Number = 1, status = undefined, name = undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/restaurants/list?${!status ? `page=${page}` : `page=${page}&status=${status}`}${name ? `&name=${name}` : ""}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }


  getAll(): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/restaurants/all`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  getAllByCountryAndCity(country: string, city: string): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/restaurants/all?country=${country}&city=${city}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  getRestaurantById(id) {
    return this.http.getWithAuth(`${this.apiUrl}/restaurants/${id}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  addRestaurant(data) {
    return this.http.postWithAuth(`${this.apiUrl}/restaurants/create`, data)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  updateRestaurantById(id, data) {
    return this.http.putWithAuth(`${this.apiUrl}/restaurants/update/${id}`, data)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  updateRestaurant(data) {
    return this.http.putWithAuth(`${this.apiUrl}/restaurants/update/restaurant`, data)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  changeRestaurantStatus(id, status) {
    return this.http.putWithAuth(`${this.apiUrl}/restaurants/change-status/${id}`, {status: status})
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  deleteRestaurant(id) {
    return this.http.deleteWithAuth(`${this.apiUrl}/restaurants/delete/${id}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  countTotal(country = undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/restaurants/countTotal${country ? `?country=${country}` : ``}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  countActive(country = undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/restaurants/countActive${country ? `?country=${country}` : ``}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  countInactive(country = undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/restaurants/countInactive${country ? `?country=${country}` : ``}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }


  exportRestaurants(page:Number = 1, status = undefined, name= undefined): Observable<any> {
    return this.http.postFileWithAuth(`${this.apiUrl}/restaurants/export-list?${!status ? `page=${page}` : `page=${page}&status=${status}`}${name ? `&name=${name}` : ""}`, {})
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }


  makeRecommend(id, value): Observable<any> {
    return this.http.putWithAuth(`${this.apiUrl}/products/make-recommend/${id}`, {recommend: value})
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)))
  }
}
