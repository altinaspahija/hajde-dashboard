import { Injectable } from '@angular/core';
import { HttpclientService } from './httpclient.service'
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {

    apiUrl: string;
    constructor(private http: HttpclientService) {
        this.apiUrl = environment.apiUrl;
    }

    getAllCategories(page?, status = undefined) {
        return this.http.getWithAuth(`${this.apiUrl}/categories${page ? `?page=${page}` : ''}${status ? `&status=${status}` : ""}`)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }


    getCategoryById(id) {
        return this.http.getWithAuth(`${this.apiUrl}/categories/${id}`)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    createCategory(category) {
        console.log(category, 'category here')
        return this.http.postWithAuth(`${this.apiUrl}/categories`, category)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    updateCategory(id, category) {
        return this.http.putWithAuth(`${this.apiUrl}/categories/${id}`, category)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    updateCategoryStatus(id, status) {
        return this.http.putWithAuth(`${this.apiUrl}/categories/status/${id}`, {status: status})
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    deleteCategory(id) {
        return this.http.deleteWithAuth(`${this.apiUrl}/categories/${id}`)
            .pipe(map((res: any) => {
                return res;
            }), catchError(err => throwError(err)))
    }

    getCategoriesList(type){
        return this.http.getWithAuth(`${this.apiUrl}/categories/type/${type}`)
        .pipe(map((res: any) => {
            return res;
        }), catchError(err => throwError(err)))
    }
}
