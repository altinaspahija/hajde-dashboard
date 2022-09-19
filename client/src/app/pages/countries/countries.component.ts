import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountryService } from 'app/services/country.service';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-countries-page',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  public countries: any[] = []

  constructor(
    private countryService: CountryService,
    private router: Router
  ) {
    this.countryService.getAllCountries()
      .subscribe(data => this.countries = data);
  }

  ngOnInit(): void {
  }

  public delete(countryId: string) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë shtet?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.countryService.removeCountry(countryId)
          .subscribe(() => {
            swal.default.fire("Sukses", "Shteti është fshirë me sukses", 'success');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/admin/countries"]));
          });
      }
    }, (error) => {
      swal.default.fire("Njoftim", error.error.error, 'warning');
    })
  }
}
