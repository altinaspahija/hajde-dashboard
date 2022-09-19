import { Injectable } from '@angular/core';
import { HttpclientService } from './httpclient.service'
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthUsersService {

    public productLimitations: any[] = [];

    public apiUrl: string;
    constructor(private http: HttpclientService) {
        this.apiUrl = environment.socketUrl + "/api";

        this.getAll()
            .subscribe(data => {
                for (const d of data) {
                    this.productLimitations.push({
                        _id: d.name,
                        title: d.value
                    });
                }
            });
    }

    public getAll() {
        return this.http.getWithAuth(`${this.apiUrl}/auth-users`)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }


    public get(id: string) {
        return this.http.getWithAuth(`${this.apiUrl}/auth-users/${id}`)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    public create(body: any) {
        return this.http.postWithAuth(`${this.apiUrl}/auth-users`, body)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    public update(id: string, body: any) {
        return this.http.putWithAuth(`${this.apiUrl}/auth-users/${id}`, body)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    public patch(id: string, body: any) {
        return this.http.postWithAuth(`${this.apiUrl}/auth-users/${id}`, body)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    public remove(id: string) {
        return this.http.deleteWithAuth(`${this.apiUrl}/auth-users/${id}`)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }
}