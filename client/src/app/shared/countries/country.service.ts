import { Injectable } from '@angular/core';
import { HttpclientService } from 'app/services/httpclient.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Country } from "./Country";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private readonly url = environment.socketUrl + "/api/countries";
  
  constructor(private http: HttpclientService) {}
   
  public getAllCountries(): Observable<Country[]> {
    return this.http.getWithAuth<Country[]>(this.url)
  }
}
