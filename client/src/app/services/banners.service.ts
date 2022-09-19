import { Injectable } from '@angular/core';
import {HttpclientService} from './httpclient.service'
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BannersService {

  apiUrl:string;
  constructor(private http: HttpclientService) { 
    this.apiUrl = environment.apiUrl;
  }

  getAllBanners(page = 1, status = undefined) {
      return this.http.getWithAuth(`${this.apiUrl}/banners/list?page=${page}${status ? `&status=${status}` : ""}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  getBannerById(id) {
    return this.http.getWithAuth(`${this.apiUrl}/banners/${id}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  createBanner(banner) {
    return this.http.postWithAuth(`${this.apiUrl}/banners/create`, banner)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  updateBanner(id, banner) {
    return this.http.putWithAuth(`${this.apiUrl}/banners/update/${id}`, banner)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }


  changeStatus(id, status) {
    return this.http.putWithAuth(`${this.apiUrl}/banners/change-stauts/${id}`, {status})
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  deleteBanner(id) {
    return this.http.deleteWithAuth(`${this.apiUrl}/banners/delete/${id}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }
}
