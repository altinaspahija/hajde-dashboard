import { Injectable } from '@angular/core';
import { HttpclientService } from './httpclient.service'
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  readonly apiUrl: string;

  constructor(private http: HttpclientService) {
    this.apiUrl = `${environment.socketUrl}/api`;
  }

  public getAllCountries(): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/countries`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  public getCountry(id: string) {
    return this.http.getWithAuth(`${this.apiUrl}/countries/${id}`)
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)));
  }

  public getCountriesMapping(countryId: string) {
    return this.http.getWithAuth(`${this.apiUrl}/countries-map/country/${countryId}`)
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)));
  }

  public getCitiesMapping(cityId: string) {
    return this.http.getWithAuth(`${this.apiUrl}/cities-map/city/${cityId}`)
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)));
  }

  public createCountry(body: any) {
    return this.http.postWithAuth(`${this.apiUrl}/countries`, body)
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)));
  }

  public removeCountry(countryId: string) {
    return this.http.deleteWithAuth(`${this.apiUrl}/countries/${countryId}`)
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)));
  }

  public updateCountry(countryId: string, body: any) {
    return this.http.putWithAuth(`${this.apiUrl}/countries/${countryId}`, body)
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)));
  }

  public findAddress(fullAddress: string) {
    return this.http.getWithAuth(`${this.apiUrl}/geolocation/find?query=${fullAddress}`)
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)));
  }

  public findLatLng(lat: any, lng: any) {
    return this.http.getWithAuth(`${this.apiUrl}/geolocation/reverse?lat=${lat}&long=${lng}`)
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)));
  }

  public findZoneByLatLng(lat: any, lng: any) {
    return this.http.getWithAuth(`${this.apiUrl}/geolocation/find-zone-by-address?lat=${lat}&long=${lng}`)
    .pipe(map((res: any) => {
      return res;
    }), catchError(err => throwError(err)));
  }
}
