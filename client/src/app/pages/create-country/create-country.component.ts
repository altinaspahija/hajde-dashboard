import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CountryService } from 'app/services/country.service';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-create-country',
  templateUrl: './create-country.component.html',
  styleUrls: ['./create-country.component.css']
})
export class CreateCountryComponent implements OnInit {

  public countryFormGroup: UntypedFormGroup;
  public submittedCountry: false;

  constructor(
    private fb: UntypedFormBuilder,
    private countriesService: CountryService,
    private router: Router
  ) {
    this.countryFormGroup = this.fb.group({
      name: ['', Validators.required],
      abbv: ['', Validators.required],
      prefix: ['', Validators.required],
      currency: ['', Validators.required],
      transportPrice: ['', Validators.required],
      cities: [],
      city: [''],
      capital: [false]
    });
  }

  public ngOnInit(): void {
  }

  public addCity(event: any) {
    event.preventDefault();

    if (this.cityControl.value) {
      const cities = [...this.citiesControl.value || []];

      if (this.capitalControl.value && cities.find(f => f.capital === true)) {
        
        swal.default.fire({
          title: "Nuk lejohet te shtohet qyteti pasi qe ekziston nje kryeqytet ! ",
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: "Ok",
          cancelButtonText: "Jo"
        });

        return;
      }
      cities.push({ name: this.cityControl.value, capital: this.capitalControl.value });

      this.citiesControl.patchValue(cities);
      this.cityControl.patchValue('');
      this.capitalControl.patchValue(false);
    }
  }

  public addCountry() {
    if (this.countryFormGroup.valid) {

      const body = this.countryFormGroup.value;
      delete body.city;
      delete body.capital;

      this.countriesService.createCountry(body)
        .subscribe(() => {
          this.router.navigate(["/admin/countries"]);
        });
    }
  }

  public removeCity(index: number) {
    const cities = [...this.citiesControl.value || []];
    if (cities.length > index) {
      cities.splice(index, 1);
      this.citiesControl.patchValue(cities);
    }
  }

  public get citiesControl() {
    return this.countryFormGroup.get('cities');
  }

  public get cityControl() {
    return this.countryFormGroup.get('city');
  }

  public get nameControl() {
    return this.countryFormGroup.get('name');
  }

  public get abbvControl() {
    return this.countryFormGroup.get('abbv');
  }

  public get prefixControl() {
    return this.countryFormGroup.get('prefix');
  }

  public get currencyControl() {
    return this.countryFormGroup.get('currency');
  }

  public get transportPriceControl() {
    return this.countryFormGroup.get('transportPrice');
  }

  public get capitalControl() {
    return this.countryFormGroup.get('capital');
  }
}
