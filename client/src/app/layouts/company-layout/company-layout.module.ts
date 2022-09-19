import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CompanyLayoutRoutes } from './company-layout.routing';
import { DashboardComponent } from '../../company-pages/dashboard/dashboard.component';
import { EmployeesComponent } from '../../company-pages/employees/employees.component';
import { UpdateEmployeeComponent } from '../../company-pages/update-employee/update-employee.component';
import { OrdersComponent } from '../../company-pages/orders/orders.component';
import { OrderComponent } from '../../company-pages/order/order.component';
import { AddEmployeeComponent } from '../../company-pages/add-employee/add-employee.component';
import { ProfileComponent } from '../../company-pages/profile/profile.component';
import { ProductsComponent } from '../../company-pages/products/products.component';
import { CreateProductComponent } from '../../company-pages/create-product/create-product.component';
import { UpdateProductComponent } from '../../company-pages/update-product/update-product.component';
import { ImportProductsComponent } from '../../company-pages/import-products/import-products.component';
import { ProductComponent } from '../../company-pages/product/product.component';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { registerLocaleData } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

import localeFr from '@angular/common/locales/fr';
import { SharedModule } from 'app/shared/shared.module';
registerLocaleData(localeFr);

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CompanyLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    SharedModule
  ],
  declarations:[
    DashboardComponent,
    EmployeesComponent,
    UpdateEmployeeComponent,
    OrdersComponent,
    OrderComponent,
    AddEmployeeComponent,
    ProfileComponent,
    ProductsComponent,
    ProductComponent,
    CreateProductComponent,
    UpdateProductComponent,
    ImportProductsComponent,
  ]
})

export class  CompanyLayoutModule {}