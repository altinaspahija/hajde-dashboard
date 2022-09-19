import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import {HttpclientService} from './httpclient.service'
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  apiUrl: string;

  constructor(private http: HttpclientService) {
    this.apiUrl = environment.apiUrl
  }

  changePassword(data:any) {
    return this.http.putWithAuth(`${this.apiUrl}/accounts/change-password`,data)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  updateUser(data: any) {
    return this.http.putWithAuth(`${this.apiUrl}/accounts/update`, data)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)));
  }


  getAccountById(id:any) {
    return this.http.getWithAuth(`${this.apiUrl}/accounts/${id}`)
      .pipe(map((res:any) => {
        return res;
    }), catchError(err => throwError(err)));
  }
}
