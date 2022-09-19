import { Injectable } from '@angular/core';
import {HttpclientService} from './httpclient.service'
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  apiUrl: string;
  constructor(private http: HttpclientService) { 
    this.apiUrl = environment.apiUrl;
  }

  getCategories(type) {
    return this.http.getWithAuth(`${this.apiUrl}/category/${type}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  getSubcategories(id,type) {
    return this.http.getWithAuth(`${this.apiUrl}/category/${id}/subcategories/${type}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }
  
}
