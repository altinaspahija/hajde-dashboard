import { Injectable } from '@angular/core';
import {HttpclientService} from './httpclient.service'
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  apiUrl:string;
  socketUrl: string;

  constructor(private http: HttpclientService) { 
    this.apiUrl = environment.apiUrl;
    this.socketUrl = environment.socketUrl + "/api"
  }

  getAllOrders(page = 1, status = undefined, courier = undefined, company = undefined, orderNr = undefined, fromDate = undefined, toDate = undefined, clientName = undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/orders/list?${!status ? `page=${page}` :  `page=${page}&status=${status}`}${courier ? `&courier=${courier}` : ''}${company ? `&company=${company}` : ''}${orderNr ? `&orderNumber=${orderNr}` : ''}${fromDate ? `&fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}${clientName ? `&clientName=${clientName}` : ''}`)
        .pipe(map((res:any) => {
          return res;
        }), catchError(err => throwError(err)))
  }

  getAllOrdersForCompany(page = 1, status = undefined, courier = undefined, orderNr = undefined, fromDate = undefined, toDate = undefined): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/orders/list-company?${!status ? `page=${page}` :  `page=${page}&status=${status}`}${courier ? `&courier=${courier}` : ''}${orderNr ? `&orderNumber=${orderNr}` : ''}${fromDate ? `&fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
        .pipe(map((res:any) => {
          return res;
        }), catchError(err => throwError(err)))
  }

  getOrderByID(id) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/${id}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  getCountOfOrder(companyId) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/count/company/${companyId}`)
      .pipe(map((res:any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  getRevenueAdmin(fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/revenue/all${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  getRevenueAdminEur(fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/revenue/all/eur${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  getRevenueCompany(fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/revenue/company${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  getRevenueCompanyById(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/revenue/company/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  getRevenueCourier(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/revenue/courier/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  getRevenueCourierEur(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/revenue/courier/eur/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countTotal(fromDate=undefined, toDate=undefined, country = undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countAllTotal${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}${country ? `${fromDate ? '&' :'?'}country=${country}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyTotal(fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyTotal${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyTotalById(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyTotal/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCourierTotal(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCourierTotal/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countAllInProgress(fromDate=undefined, toDate=undefined, country = undefined) {
    const queryObj = {};
    if (fromDate) {
      queryObj["fromDate"] = fromDate;
    }
    if (toDate) {
      queryObj["toDate"] = toDate;
    }
    if (country) {
      queryObj["country"] = country;
    }

    const params = new URLSearchParams(queryObj);

    return this.http.getWithAuth(`${this.apiUrl}/orders/countAllInProgress?${params.toString()}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyInProgress(fromDate=undefined, toDate=undefined) {
    const queryObj = {};
    if (fromDate) {
      queryObj["fromDate"] = fromDate;
    }
    if (toDate) {
      queryObj["toDate"] = toDate;
    }
    
    const params = new URLSearchParams(queryObj);

    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyInProgress?${params.toString()}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyInProgressById(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyInProgress/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCourierInProgress(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCourierInProgress/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countAllCompleted(fromDate=undefined, toDate=undefined, country = undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countAllCompleted${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}${country ? `${fromDate ? '&' :'?'}country=${country}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyCompleted(fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyCompleted${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyCompletedById(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyCompleted/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCourierCompleted(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCourierCompleted/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countAllIssue(fromDate=undefined, toDate=undefined, country = undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countAllIssue${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}${country ? `${fromDate ? '&' :'?'}country=${country}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyIssue(fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyIssue${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyIssueById(id,fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyIssue/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCourierIssue(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCourierIssue/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countAllRejected(fromDate=undefined, toDate=undefined, country = undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countAllRejected${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}${country ? `${fromDate ? '&' :'?'}country=${country}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyRejected(fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyRejected${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyRejectedById(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyRejected/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCourierRejected(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCourierRejected/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countAllPending(fromDate=undefined, toDate=undefined, country = undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countAllPending${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}${country ? `${fromDate ? '&' :'?'}country=${country}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyPending(fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyPending${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyPendingById(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyPending/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCourierPending(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCourierPending/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }


  countAllCancelled(fromDate=undefined, toDate=undefined, country = undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countAllCancelled${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}${country ? `${fromDate ? '&' :'?'}country=${country}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyCancelled(fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyCancelled${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCompanyCancelledById(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCompanyCancelled/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  countCourierCancelled(id, fromDate=undefined, toDate=undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/orders/countCourierCancelled/${id}${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  rejectOrder(id, issue) {
    return this.http.putWithAuth(`${this.apiUrl}/orders/reject/${id}`, {issue: issue})
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }


  approveOrder(id) {
    return this.http.putWithAuth(`${this.apiUrl}/orders/approve/${id}`, {})
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  readyOrder(id) {
    return this.http.putWithAuth(`${this.apiUrl}/orders/ready/${id}`, {})
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }

  addProduct(id, data) {
    return this.http.putWithAuth(`${this.apiUrl}/orders/${id}/addProduct`, data)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }


  deleteService(id, data) {
    return this.http.putWithAuth(`${this.apiUrl}/orders/${id}/delete-typed-product`, data)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }


  deleteProduct(id, productId) {
    return this.http.deleteWithAuth(`${this.apiUrl}/orders/${id}/delete-specific-product/${productId}`)
     .pipe(map((res:any) => {
       return res;
     }), catchError(err => throwError(err)));
  }


  updateProduct(id, productId, data) {
    return this.http.putWithAuth(`${this.apiUrl}/orders/${id}/update-specific-product/${productId}`, data)
    .pipe(map((res:any) => {
      return res;
    }), catchError(err => throwError(err)))
  }


  exportAdmin(page = 1, status = undefined, courier = undefined, company = undefined, orderNr = undefined, fromDate = undefined, toDate = undefined, clientName = undefined): Observable<any> {
    return this.http.postFileWithAuth(`${this.apiUrl}/orders/export-list${!status ? `?page=${page}` :  `?page=${page}&status=${status}`}${courier ? `&courier=${courier}` : ''}${company ? `&company=${company}` : ''}${orderNr ? `&orderNumber=${orderNr}` : ''}${fromDate ? `&fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}${clientName ? `&clientName=${clientName}` : ''}`,{})
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));  
  }

  exportCompany(page = 1, status = undefined, courier = undefined, orderNr = undefined, fromDate = undefined, toDate = undefined): Observable<any> {
    return this.http.postFileWithAuth(`${this.apiUrl}/orders/export-list-company${!status ? `?page=${page}` :  `?page=${page}&status=${status}`}${courier ? `&courier=${courier}` : ''}${orderNr ? `&orderNumber=${orderNr}` : ''}${fromDate ? `&fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`,{})
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }


  exporStatstCSVAdmin(fromDate=undefined, toDate=undefined): Observable<any> {
    return this.http.postFileWithAuth(`${this.apiUrl}/orders/export-csv${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`,{})
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  exporStatstCSVCompany(fromDate=undefined, toDate=undefined): Observable<any> {
    return this.http.postFileWithAuth(`${this.apiUrl}/orders/company/export-csv-withoutid${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`, {})
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  exporStatstCSVCompanyWithId(id,fromDate=undefined, toDate=undefined): Observable<any> {
    return this.http.postFileWithAuth(`${this.apiUrl}/orders/company/export-csv/${id}/${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`, {})
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  exporStatstCSVCourierWithId(id,fromDate=undefined, toDate=undefined): Observable<any> {
    return this.http.postFileWithAuth(`${this.apiUrl}/orders/courier/export-csv/${id}/${fromDate ? `?fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`, {})
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  createOrder(data) {
    return this.http.postFileWithAuth(`${this.apiUrl}/orders/create`, data)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  createOrderCompany(data) {
    return this.http.postFileWithAuth(`${this.apiUrl}/orders/company/create`, data)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  calculateTransport(userAddresses: string, supplierAddresses: string, country: string) {
    return this.http.postWithAuth(`${this.socketUrl}/basket/calculate-transport`, { userAddresses, supplierAddresses, country })
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }
}
