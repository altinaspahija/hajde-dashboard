import { Injectable } from '@angular/core';
import {HttpclientService} from './httpclient.service'
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  apiUrl: string;
  constructor(private http: HttpclientService) {
    this.apiUrl = environment.apiUrl;
  }

  getAllCompanies(page:Number = 1, status = undefined, name= undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/companies/list?${!status ? `page=${page}` : `page=${page}&status=${status}`}${name ? `&name=${name}` : ""}`)
     .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  getCompanyById(id) {
    return this.http.getWithAuth(`${this.apiUrl}/companies/${id}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  addCompany(data): Observable<any> {
    return this.http.postWithAuth(`${this.apiUrl}/companies/create`, data)
      .pipe(map((res:any) => {
          return res;
      }), catchError(err => throwError(err)))
  }

  updateCompany(id, data): Observable<any> {
    return this.http.putWithAuth(`${this.apiUrl}/companies/update/${id}`,data)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }


  updateCompanyUser(data): Observable<any> {
    return this.http.putWithAuth(`${this.apiUrl}/companies/update/company`,data)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  changeCompanyStatus(id, status): Observable<any> {
    return this.http.putWithAuth(`${this.apiUrl}/companies/change-status/${id}`, {status:status})
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  deleteCompany(id): Observable<any> {
    return this.http.deleteWithAuth(`${this.apiUrl}/companies/delete/${id}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  countTotal(country = undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/companies/countTotal${country ? `?country=${country}` : ``}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

      countActive(country = undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/companies/countActive${country ? `?country=${country}` : ``}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  countInactive(country = undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/companies/countInactive${country ? `?country=${country}` : ``}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }


  exportCompany(page:Number = 1, status = undefined, name= undefined): Observable<any> {
    return this.http.postFileWithAuth(`${this.apiUrl}/companies/export-list?${!status ? `page=${page}` : `page=${page}&status=${status}`}${name ? `&name=${name}` : ""}`, {})
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }


  getAllComp(): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/companies/all`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  getAllByCountryAndCity(country: string, city: string): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/companies/all?country=${country}&city=${city}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  getCompanyData(data: any) {
    return {
      _id: data._id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
      companyId: data.companyId,
      currencyType: data.currencyType
    };
  }

}

