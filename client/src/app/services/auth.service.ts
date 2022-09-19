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
export class AuthService {
  apiUrl: string;
  token: string;
  email: string;
  authHeaders: HttpHeaders;
  redirectUrl: string;
  helper: JwtHelperService


  constructor(private http: HttpclientService) { 
    this.apiUrl = environment.apiUrl;
    this.helper = new JwtHelperService();
    this.authHeaders = this.loadToken();
  }

  loadToken():HttpHeaders {
    this.token = localStorage.getItem("token");
    this.email = localStorage.getItem("email");
  
    this.authHeaders =  new HttpHeaders();
    this.authHeaders.append("Authorization", this.token);
    
    return this.authHeaders;
   }

   findUser(phone: string) {
      return this.http.getWithAuth(`${this.apiUrl}/clients/get-client-by-phone/${phone}`)
      .pipe(map((res: any) => {
        if(res) {
          return res;
        } else {
          return false;
        }
     }), catchError(err => throwError(err)));
   }

   getAllCouriers() {
    const itemPerPage = 9999;
    return this.http.getWithAuth(`${this.apiUrl}/couriers/list?itemPerPage=${itemPerPage}`)
      .pipe(map((res: any) => {
        if(res) {
          return res;
        } else {
          return false;
        }
     }), catchError(err => throwError(err)));
   }

   getEmail() {
    this.email = localStorage.getItem("email");
    return this.email;
   }
 
   authUser(req: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/auth`, req)
      .pipe(map((res: any) => {
         if(res) {
           return res;
         } else {
           return false;
         }
      }), catchError(err => throwError(err)))
   }
 
   forgot_password(req: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, req)
    .pipe(map((res: any) => {
       if(res) {
         return res;
       } else {
         return false;
       }
    }), catchError(err => throwError(err)))
 }
 
   storeToken(token) {
     localStorage.setItem("token",token);
     this.token = token;
   }

   storeEmail(email) {
    localStorage.setItem("email",email);
    this.email = email;
  }
 
   getUser() {
     return this.helper.decodeToken(localStorage.getItem("token"));
   }
 
   loggedIn(): boolean {
    if (!this.helper.isTokenExpired(localStorage.getItem('token'))) {
      return true
    }
  }
 
  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }
 
  resetPasswordApi(req: any, token: string): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/reset-password/${token}`, req)
      .pipe(map(res => {
        if (res) {
          return true;
        }
      }), catchError(err => throwError(err)));
  }

  verifyLoginCode(email: string, code: string, otpCode: string) {
    return this.http.post(`${this.apiUrl}/verify-login/`, {email, code, otpCode})
      .pipe(map(res => {
        if (res) {
          return res;
        }
      }), catchError(err => throwError(err)));
  }

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

    return JSON.parse(jsonPayload);
  };

  getUserData() {
    return this.getCompanyData();
  }
  
  getCompanyData() {
    return this.parseJwt(localStorage.getItem("token"));
  }
}
