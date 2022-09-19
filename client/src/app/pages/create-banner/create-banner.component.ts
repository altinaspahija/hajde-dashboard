import { Component, OnInit } from '@angular/core';
import { BannersService } from '../../services/banners.service';
import { CompanyService } from '../../services/company.service';
import { RestaurantsService } from '../../services/restaurants.service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { City } from 'app/shared/cities/City';
import { Country } from 'app/shared/countries/Country';
import { CountryService } from 'app/services/country.service';

@Component({
  selector: 'app-create-banner',
  templateUrl: './create-banner.component.html',
  styleUrls: ['./create-banner.component.css']
})
export class CreateBannerComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public imageUrl = new UntypedFormControl('', [Validators.required]);
  public companyId = new UntypedFormControl('', [Validators.required]);
  public country = new UntypedFormControl('', []);
  public city = new UntypedFormControl('', []);
  public companies: any[];
  public bannerFormGroup: UntypedFormGroup;
  public submitted = false;
  public countryVal: any;

  public countrySelected;
  public countryDisabled = true;
  public cityDisabled = true;

  public citySelected;

  public supplierId;
  public supplierType;
  public suppliers: any[] = [];

  public countryCities: any[] = [];
  public countries: any[] = [];
  public street;
  public cityId;
  public countryId;
  public cities;
  public transport = 0;
  public comps;

  public companyData;

  public prefixes: any[] = [];
  public prefixId: string;
  public prefixDisable: boolean = false;

  constructor(
    public bannerFormBuilder: UntypedFormBuilder,
    private bannersService: BannersService,
    private companyService: CompanyService,
    private restaurantsService: RestaurantsService,
    private authService: AuthService,
    private countriesService: CountryService,
    private router: Router
  ) {

    this.countriesService.getAllCountries()
      .subscribe(data => {
        this.countries = data;
      });
    
    this.bannerFormGroup = bannerFormBuilder.group({
      imageUrl: this.imageUrl,
      companyId: this.companyId,
      city: this.city,
      country: this.country,
      supplierType: [''],
      title: ['']
    })

    if (this.authService.getUser().country) {
      this.countryVal = this.authService.getUser().country;
    }

    this.getAllCompanies();
  }

  ngOnInit(): void {
    this.bannerFormGroup.controls["supplierType"].valueChanges.subscribe(value => {
      if (value) {
        this.getBannerFormGroup.companyId.patchValue("");
        if (value === "market") {
          this.companyService.getAllComp()
            .subscribe(data => {
              this.comps = data.companies.map(d => {
                const cp = d;
                cp["name"] = d.company;
                return cp;
              })
            });
        } else {
          this.restaurantsService.getAll()
          .subscribe(data => {
            this.comps = data.restuarants;
          });
        }
      }
    })
  }

  get getBannerFormGroup(): any { return this.bannerFormGroup.controls };

  public getUniqueCountries(countries: string[] | string) {
    if (typeof countries === "string") {
      return countries;
    } else {
      const countriesRet = [];
      for (const country of countries) {
        if (!countriesRet.includes(country)) {
          countriesRet.push(country);
        }
      }

      return countriesRet;
    }
  }

  public getUniqueCities(cities: string[] | string) {
    if (typeof cities === "string") {
      return cities;
    } else {
      const citiesRet = [];
      for (const city of cities) {
        if (!citiesRet.includes(city)) {
          citiesRet.push(city);
        }
      }

      return citiesRet;
    }
  }

  public onFileChange(event, inputName) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      let fls = {}
      reader.onload = () => {
        this.bannerFormGroup.patchValue({
          'imageUrl': reader.result
        });
      }
    }
  }


  public addBanner() {
    this.submitted = true;

    if (this.bannerFormGroup.valid) {
      let body = {
        imageUrl: this.bannerFormGroup.get('imageUrl').value,
        country: this.bannerFormGroup.get('country').value,
        city: this.bannerFormGroup.get("city").value,
        companyId: this.bannerFormGroup.get('companyId').value,
        type: this.bannerFormGroup.get('supplierType').value === "market" ? 2 : 1,
        title: this.bannerFormGroup.get('title').value,
      }

      this.bannersService.createBanner(body)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
          swal.default.fire("Sukses", "Baneri u shtua me sukses", 'success');
          this.router.navigate(['/admin/banners'])
        },
          error => {
            swal.default.fire("Njoftim", error.error.error.error, 'warning');
          })
    }
  }

  public getAllCompanies() {

    this.companyService.getAllComp()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.companies = [...data.companies]

        this.restaurantsService.getAll()
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe(data => {

            this.companies = [...this.companies, ...data.restuarants]
          })

      })
  }

  public handleCountryChange(event: any) {
    this.supplierType = "";
    this.supplierId = "";

    const country = event as Country;
    if (country) {
      this.cities = country.cities;
      this.countryId = country.name;
      this.getBannerFormGroup.country.patchValue(country.name);
    } else {
      this.cities = [];
      this.getBannerFormGroup.country.patchValue("");
    }
  }

  public handleCityChange(event: any) {
    this.supplierType = "";
    this.supplierId = "";

    const city = event as City;

    if (city) {
      this.getBannerFormGroup.city.patchValue(city.name);
    } else {
      this.getBannerFormGroup.city.patchValue("");
    }
  }

  public changeSupplierType($event) {
    console.log($event);
  }
}
