import { Injectable } from '@angular/core';
import { HttpclientService } from './httpclient.service'
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class OffersService {
  apiUrl:string;
  socketUrl: string;

  constructor(private http: HttpclientService) {
    this.apiUrl = environment.apiUrl;
    this.socketUrl = environment.socketUrl + "/api";
  }

  getAllOffers(page = 1,  offerType = undefined,  status = undefined,  fromDate = undefined, toDate = undefined) {
    return this.http.getWithAuth(`${this.apiUrl}/offers/list?${!status ? `page=${page}` : `page=${page}&status=${status}`}${offerType ? `&offerType=${offerType}` : ""}${fromDate ? `&fromDate=${fromDate}` : ""}${toDate ? `&toDate=${toDate}` : ""}`)
     .pipe(map((res:any) => {  
      return res;
    }), catchError(err => throwError(err)));
  }

  createOffer(offer) {
    return this.http.postWithAuth(`${this.apiUrl}/offers/create`, offer)
    .pipe(map((res:any) => {  
      return res;
    }), catchError(err => throwError(err)));
  }

  downloadCsv(offerId) {
    return this.http.getFileWithAuth(`${this.socketUrl}/offers/get-offers-user/${offerId}`)
     .pipe(map((res:any) => {  
      return res;
    }), catchError(err => throwError(err)));
  }

  updateOffer(id, offer) {
    return this.http.putWithAuth(`${this.apiUrl}/offers/${id}/update`, offer)
    .pipe(map((res:any) => {  
      return res;
    }), catchError(err => throwError(err)));
  }

  changeStatus(id, status) {
    return this.http.putWithAuth(`${this.apiUrl}/offers/${id}/change-status`, {status: status})
    .pipe(map((res:any) => {  
      return res;
    }), catchError(err => throwError(err)));
  }

  delete(id) {
    return  this.http.deleteWithAuth(`${this.apiUrl}/offers/${id}/delete`)
    .pipe(map((res:any) => {  
      return res;
    }), catchError(err => throwError(err)));
  }

  getOfferById(id) {
    return this.http.getWithAuth(`${this.apiUrl}/offers/${id}`)
    .pipe(map((res:any) => {  
      return res;
    }), catchError(err => throwError(err)));
  }

  getPotentialWinners(from="", to="", country="", minimumValue="") {
    return this.http.getWithAuth(`${this.apiUrl}/offers/potential-winners?from=${from}&to=${to}&country=${country}&minimumValue=${minimumValue}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  pushNotification(id: string) {
    return this.http.postWithAuth(`${this.socketUrl}/offers/${id}/push-notification`, {})
    .pipe(map((res:any) => {  
      return res;
    }), catchError(err => throwError(err))); 
  }
}
