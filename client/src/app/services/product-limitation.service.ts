import { Injectable } from '@angular/core';
import { HttpclientService } from './httpclient.service'
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductLimitationService {

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

    public getAllProducts() {
        return this.http.getWithAuth(`${this.apiUrl}/products/product-limitations/get-all-products`)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    public getAll() {
        return this.http.getWithAuth(`${this.apiUrl}/products/product-limitations`)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }


    public get(id: string) {
        return this.http.getWithAuth(`${this.apiUrl}/products/product-limitations/${id}`)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    public create(body: any) {
        return this.http.postWithAuth(`${this.apiUrl}/products/product-limitations`, body)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    public update(id: string, body: any) {
        return this.http.putWithAuth(`${this.apiUrl}/products/product-limitations/${id}`, body)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    public patch(id: string, body: any) {
        return this.http.postWithAuth(`${this.apiUrl}/products/product-limitations/${id}`, body)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    public remove(id: string) {
        return this.http.deleteWithAuth(`${this.apiUrl}/products/product-limitations/${id}`)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }
}