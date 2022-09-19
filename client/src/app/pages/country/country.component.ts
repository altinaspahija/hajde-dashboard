import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryService } from 'app/services/country.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private countriesService: CountryService) { }

  public id: string;
  public country: any;
  public countryMapping: any;
  public mapping: any;
  public cityMapping: any;

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      this.id = params.get("id");

      this.countriesService
        .getCountry(this.id)
        .subscribe(data => {
          this.country = data;

          if (data && data.cities) {
            const citiesPromises = [];
            for (const city of data.cities) {
              citiesPromises.push(
                this.countriesService.getCitiesMapping(city._id).toPromise()
              );
            }

            Promise.all(citiesPromises).then(data => {
              for (const mapping of data) {
                for (const m of mapping) {
                  const cityId = m.cityId;
                  const name = m.name;

                  const cityFoundIndex = this.country.cities.findIndex(f => f._id === cityId);
                  if (cityFoundIndex > -1) {
                    const city = this.country.cities[cityFoundIndex];
                    if (city && city.mapping) {
                      if (this.country.cities[cityFoundIndex].mapping.includes(name)) {
                        continue;
                      } else {
                        this.country.cities[cityFoundIndex].mapping.push(name);
                      }
                    } else {
                      this.country.cities[cityFoundIndex].mapping = [name];
                    }
                  }
                }
              }
            })
          }

        });

      this.countriesService.getCountriesMapping(this.id)
        .subscribe(data => {
          this.countryMapping = data;
        });
    });
  }

}
