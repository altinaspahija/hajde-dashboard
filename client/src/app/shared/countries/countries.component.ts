import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Country } from './Country';
import { CountryService } from './country.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CountriesComponent implements OnInit, OnChanges {

  constructor(private service: CountryService) {}

  public countries$: Observable<Country[]>;  
  public countrySelected: Country | string = "";
  public countries: Country[] = [];

  @Input('selected') public countryInput: string;
  @Input('disabled') public disabled: boolean;

  public ngOnInit(): void {
    this.countries$ = this.service.getAllCountries()
      .pipe(tap(data => {
        this.countries = data;
        this.onCountryLoad.emit(data);
      }));
  }

  @Output() onCountryChange: EventEmitter<Country> = new EventEmitter<Country>();
  @Output() onCountryLoad: EventEmitter<Country[]> = new EventEmitter<Country[]>();

  public changeCountry() {
    const country = this.countries.find(f => f.name === this.countrySelected);
    if (country) {
      this.onCountryChange.emit(country as Country);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.countryInput && changes.countryInput.firstChange) {
      this.countrySelected = this.countryInput;
    } else if (this.countryInput) {
      this.countrySelected = this.countryInput;
    }
  }
}
