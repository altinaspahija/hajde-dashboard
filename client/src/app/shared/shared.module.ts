import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesComponent } from './countries/countries.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CitiesComponent } from './cities/cities.component';
import { CompanyOrderNewComponent } from 'app/pages/company-order-new/company-order-new.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule
  ],
  declarations: [
    CompanyOrderNewComponent,
    CountriesComponent,
    CitiesComponent
  ],
  exports: [
    CountriesComponent,
    CompanyOrderNewComponent,
    CitiesComponent
  ]
})
export class SharedModule { }
