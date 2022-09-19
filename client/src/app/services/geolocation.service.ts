import { Injectable } from '@angular/core';
import { HttpclientService } from './httpclient.service'
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  readonly apiUrl: string;

  constructor(private http: HttpclientService) {
    this.apiUrl = `${environment.socketUrl}/api`;
  }

  public getAllCountryMappings(countryId: string): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/countries-map/country/${countryId}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  public getAllCityMappings(cityId: string): Observable<any> {
    return this.http.getWithAuth(`${this.apiUrl}/cities-map/city/${cityId}`)
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

  public removeCountryMapping(countryId: string) {
    return this.http.deleteWithAuth(`${this.apiUrl}/countries/${countryId}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  public removeCityMapping(countryId: string) {
    return this.http.deleteWithAuth(`${this.apiUrl}/countries/${countryId}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  public updateCountryMapping(countryId: string, body: any) {
    return this.http.putWithAuth(`${this.apiUrl}/countries/${countryId}`, body)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }

  public updateCityMapping(countryId: string, body: any) {
    return this.http.putWithAuth(`${this.apiUrl}/countries/${countryId}`, body)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)));
  }
}
