import { Injectable } from '@angular/core';
import { HttpclientService } from './httpclient.service'
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SubcategoriesService {

    apiUrl: string;
    constructor(private http: HttpclientService) {
        this.apiUrl = environment.apiUrl;
    }

    getRestaurantSubcategories(restaurantId) {
        return this.http.getWithAuth(`${this.apiUrl}/restaurants/mapped-subcategories/${restaurantId}`)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    getCompaniesSubcategories(restaurantId) {
        return this.http.getWithAuth(`${this.apiUrl}/restaurants/mapped-subcategories/${restaurantId}`)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    createRestaurantSubcategories(restaurantId, subcategories) {
        return this.http.postWithAuth(`${this.apiUrl}/restaurants/mapped-subcategories/${restaurantId}`, subcategories)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    createCompaniesSubcategories(restaurantId, subcategories) {
        return this.http.postWithAuth(`${this.apiUrl}/companies/mapped-subcategories/${restaurantId}`, subcategories)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }
}
