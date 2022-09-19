import { Injectable } from '@angular/core';
import {HttpclientService} from './httpclient.service'
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CompanyCategoryService {
  apiUrl: string;
  constructor(private http: HttpclientService) {
    this.apiUrl = environment.apiUrl;
  }

  getAllCategories(id, page: Number = 1, status = undefined, name= undefined ) {
    return this.http.getWithAuth(`${this.apiUrl}/company-category/list/${id}?${!status ? `page=${page}` : `page=${page}&status=${status}`}${name ? `&name=${name}` : ""}`)
    .pipe(map((res:any) => {
     return res;
   }), catchError(err => throwError(err)))
  }

  getAllCategoriesSelect(id) {
    return this.http.getWithAuth(`${this.apiUrl}/company-category/getAll/${id}`)
    .pipe(map((res:any) => {
     return res;
   }), catchError(err => throwError(err)))
  }


  changeStatus(id, status) {
     return this.http.putWithAuth(`${this.apiUrl}/company-category/changeStatus/${id}`, {status:status})
     .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }
}
