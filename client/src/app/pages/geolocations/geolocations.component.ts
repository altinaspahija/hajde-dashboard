import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountryService } from 'app/services/country.service';
import { GeolocationService } from 'app/services/geolocation.service';
import { forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-geolocations',
  templateUrl: './geolocations.component.html',
  styleUrls: ['./geolocations.component.css']
})
export class GeolocationsComponent implements OnInit {

  public countries: any[] = [];
  public cities: any[] = [];
  public loading = false;

  constructor(
    private geolocationService: GeolocationService,
    private countriesService: CountryService,
    private router: Router
  ) {
    this.countriesService
      .getAllCountries()
      .pipe(
        mergeMap(countries => {
          const countryMappingsObs = [];

          for (let index = 0; index < countries.length; index++) {
            const country = countries[index];
            const mappingOb = this.geolocationService
              .getAllCountryMappings(country._id)
              .pipe(map(mapping => {
                countries[index].mapping = mapping;
                return countries[index];
              }));
            
            countryMappingsObs.push(mappingOb);
          }

          return forkJoin(countryMappingsObs);
        }),
        mergeMap((countyMappings: any) => {
          const cityMappingsObs = [];

          for (let i = 0; i < countyMappings.length; i++) {
            const country = countyMappings[i];

            for (let j = 0; j < country.cities.length; j++) {
              const city = country.cities[j];
              const mappingOb = this.geolocationService
                .getCitiesMapping(city._id)
                .pipe(map(mapping => {

                  const obj = {
                    countryId: country._id,
                    countryName: country.name,
                    countryMapping: country.mapping,
                    cityId: city._id,
                    cityName: city.name,
                    cityMapping: mapping || []
                  }

                  return obj;
                }));
                
              cityMappingsObs.push(mappingOb);
            }
          }

          return forkJoin(cityMappingsObs);
        }))
      .subscribe(
        (countries) => {
          this.countries = countries;
        },
        (error) => this.loading = true,
        () => this.loading = true
      )
  }

  public ngOnInit(): void {
  }

  public deleteCountryMapping(countryId: string) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë mapping?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.geolocationService.removeCountryMapping(countryId)
          .subscribe(() => {
            swal.default.fire("Sukses", "Mappingu është fshirë me sukses", 'success');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/admin/geolocations"]));
          });
      }
    }, (error) => {
      swal.default.fire("Njoftim", error.error.error, 'warning');
    })
  }

  public deleteCityMapping(countryId: string) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë mapping?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.geolocationService.removeCityMapping(countryId)
          .subscribe(() => {
            swal.default.fire("Sukses", "Mappingu është fshirë me sukses", 'success');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/admin/geolocations"]));
          });
      }
    }, (error) => {
      swal.default.fire("Njoftim", error.error.error, 'warning');
    })
  }
}
