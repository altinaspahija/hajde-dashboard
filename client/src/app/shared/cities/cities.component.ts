import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { City } from './City';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CitiesComponent implements OnInit, OnChanges {

  constructor() {}

  public citySelected: City | string = "";

  public ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.cityInput && changes.cityInput.firstChange) {
      this.citySelected = this.cityInput;
    } else if (this.cityInput) {
      this.citySelected = this.cityInput;
    }
  }

  @Input() cities: City[] = [];
  @Input('selected') public cityInput: string;
  @Input('disabled') public disabled: boolean = false;

  @Output() onCityChange = new EventEmitter<City>();

  public changeCity() {
    const city = this.cities.find(city => city.name === this.citySelected);
    if (city) {
      this.onCityChange.emit(city as City); 
    }
  }
}
