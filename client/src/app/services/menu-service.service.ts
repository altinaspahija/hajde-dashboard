import { Injectable } from '@angular/core';
import { HttpclientService } from './httpclient.service'
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MenuServiceService {
  apiUrl:string;

  constructor(private http: HttpclientService) {
    this.apiUrl = environment.apiUrl;
  }

  getAllProductsForAdmin(id, page = 1, name = undefined, productCode = undefined, status = undefined): Observable<any> {
      return this.http.postWithAuth(`${this.apiUrl}/menus/list-admin${!name ? `?page=${page}` : `?page=${page}&name=${name}`}${productCode ? `&productCode=${productCode}` : ''}${status ? `&status=${status}` : ''}`, {companyId: id})
        .pipe(map((res:any) => {
          return res;
        }), catchError(err => throwError(err)));
  }

  getAllProductsForAdminWithoutPagination(id): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/menus/list-admin-all/${id}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)));
}

  getAllProductsForCompany(page = 1, name = undefined, productCode = undefined, status = undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/menus/list-company${!name ? `?page=${page}` : `?page=${page}&name=${name}`}${productCode ? `&productCode=${productCode}` : ''}${status ? `&status=${status}` : ''} `)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  exportProducts(): Observable<any> {
    return this.http.postFileWithAuth(`${this.apiUrl}/menus/export-list-company`, {})
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  exportProductsAdmin(id): Observable<any> {
    return this.http.postFileWithAuth(`${this.apiUrl}/menus/export-list-admin/${id}`, {})
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  import(data): Observable<any> {
    return this.http.postWithAuth(`${this.apiUrl}/menus/import`, data)
      .pipe(map((res: any) => {
        return res;
      } ), catchError(err => throwError(err)))
  }

  importWithId(id,data): Observable<any> {
    return this.http.postWithAuth(`${this.apiUrl}/menus/import/${id}`, data)
      .pipe(map((res: any) => {
        return res;
      } ), catchError(err => throwError(err)))
  }

  createProduct(data): Observable<any> {
    return this.http.postWithAuth(`${this.apiUrl}/menus/create`, data)
      .pipe(map(( res:any )=> {
        return res;
      }),  catchError(err => throwError(err)))
  }

  updateProduct(id, data): Observable<any> {
    return this.http.putWithAuth(`${this.apiUrl}/menus/update/${id}`, data)
      .pipe(map(( res:any ) => {
        return res;
      }), catchError(err => throwError(err)))
  }


  updateStatus(id, data): Observable<any> {
    return this.http.putWithAuth(`${this.apiUrl}/menus/${id}/changeStatus`, data)
      .pipe(map(( res:any ) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  deleteProduct(id): Observable<any> {
    console.log("here");
    return this.http.deleteWithAuth(`${this.apiUrl}/menus/delete/${id}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }


  getProduct(id): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/menus/${id}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }


  getProduts(id): Observable<any> {
    if (!id) {
      return;
    }
    return this.http.getWithAuth(`${this.apiUrl}/menus/list-all/${id}`)
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  getAllProducts(id): Observable<any> {
    if (!id) {
      return;
    }
    return this.http.getWithAuth(`${this.apiUrl}/menus/list-all/${id}`)
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  getAllProductsWithoutPagination(id): Observable<any> {
    if (!id) {
      return;
    }
    return this.http.getWithAuth(`${this.apiUrl}/menus/list-all/${id}`)
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  generategooglesheet(): Observable<any> {
    return this.http.postWithAuth(`${this.apiUrl}/menus/generate-google-sheet`, {})
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  makeRecommend(id, value): Observable<any> {
    return this.http.putWithAuth(`${this.apiUrl}/menus/make-recommend/${id}`, {recommend: value})
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)))
  }
}
