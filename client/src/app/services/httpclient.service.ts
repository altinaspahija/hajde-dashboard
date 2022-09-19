import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpclientService {

  constructor(private http: HttpClient) { }

  setAuthHeaders() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', token);
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

  get(url: string) {
    return this.http.get(url);
  }



  post(url: string, body: any) {
    return this.http.post(url, body);
  }

  put(url: string, body: any) {
    return this.http.put(url, body);
  }

  delete(url: string) {
    return this.http.delete(url);
  }

  getWithAuth<T>(url: string) {
    const headers = this.setAuthHeaders();
    const rs =  this.http.get<T>(url, { headers: headers });
    return rs;
  }

  postWithAuth(url: string, body: any) {
    const headers = this.setAuthHeaders();
    return this.http.post(url, body, { headers: headers });
  }

  patchWithAuth(url: string, body: any) {
    const headers = this.setAuthHeaders();
    return this.http.patch(url, body, { headers: headers });
  }

  putWithAuth(url: string, body: any) {
    const headers = this.setAuthHeaders();
    return this.http.put(url, body, { headers: headers });
  }

  deleteWithAuth(url) {
    const headers = this.setAuthHeaders();
    return this.http.delete(url, { headers: headers });
  }

  getFileWithAuth(url: string) {
    const headers = this.setAuthHeaders();
    const rs = this.http.get(url, { headers: headers, responseType: 'arraybuffer', observe: 'response'});
    return rs;
  }

  postFileWithAuth(url: string, body:any) {
    const headers = this.setAuthHeaders();
    const rs = this.http.post(url, body,{ headers: headers, responseType: 'arraybuffer', observe: 'response'});
    return rs;
  }
}
