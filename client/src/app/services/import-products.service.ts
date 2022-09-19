import { Injectable } from '@angular/core';
import { HttpclientService } from './httpclient.service'
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ImportProductsService {
    apiUrl: string;

    constructor(private http: HttpclientService) {
        this.apiUrl = environment.apiUrl;
    }

    getProducts() {
        return this.http.postWithAuth(`${this.apiUrl}/menus/get-products`,null)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    uploadProducts(payload) {
        return this.http.postWithAuth(`${this.apiUrl}/menus/update-products`, {products: payload})
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }
}
