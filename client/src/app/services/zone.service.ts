import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { HttpclientService } from './httpclient.service';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  public zones: any[] = [];

  public apiUrl: string;
  
  constructor(private http: HttpclientService) {
    this.apiUrl = environment.socketUrl + "/api";
  }

  public getById(id: string) {
    return this.http.getWithAuth(`${this.apiUrl}/zones/${id}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  public getAll() {
    return this.http.getWithAuth(`${this.apiUrl}/zones`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  public getZoneById(id) {
    return this.http.getWithAuth(`${this.apiUrl}/zones?zoneId=${id}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  public saveMappings(id: string, mappings: any[]) {
    return this.http.postWithAuth(`${this.apiUrl}/zones/${id}/mappings`, mappings)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  public get(id: string) {
    return this.http.getWithAuth(`${this.apiUrl}/zones/${id}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  public getAllZoneMappings(id: string) {
    return this.http.getWithAuth(`${this.apiUrl}/zones/${id}/mappings`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  public deleteMapping(id) {
    return this.http.deleteWithAuth(`${this.apiUrl}/zones/mappings/${id}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  public getDetails(id: string) {
    return this.http.getWithAuth(`${this.apiUrl}/zones/${id}/details`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  public create(body: any) {
    return this.http.postWithAuth(`${this.apiUrl}/zones`, body)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  public createMapping(body: any) {
    return this.http.postWithAuth(`${this.apiUrl}/zones/mappings`, body)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  public update(id: string, body: any) {
    return this.http.putWithAuth(`${this.apiUrl}/zones/${id}`, body)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  public patch(id: string, body: any) {
    return this.http.postWithAuth(`${this.apiUrl}/zones/${id}`, body)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }

  public remove(id: string) {
    return this.http.deleteWithAuth(`${this.apiUrl}/zones/${id}`)
      .pipe(map((res: any) => {
        return res;
      }), catchError(err => throwError(err)))
  }
}
