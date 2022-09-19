import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {RestaurantLayoutRoutes} from './restaurant-layout.routing';
import { DashboardComponent } from '../../restaurant-pages/dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrdersComponent } from '../../restaurant-pages/orders/orders.component';
import { OrderComponent } from '../../restaurant-pages/order/order.component';
import { ProductsComponent } from '../../restaurant-pages/products/products.component';
import { ProductComponent } from '../../restaurant-pages/product/product.component';
import { UpdateProductComponent } from '../../restaurant-pages/update-product/update-product.component';
import { ImportProductsComponent } from '../../restaurant-pages/import-products/import-products.component';
import { CreateProductComponent } from '../../restaurant-pages/create-product/create-product.component';
import { CreateProductV2Component } from 'app/restaurant-pages/create-product-v2/create-product-v2.component';
import { ProfileComponent } from '../../restaurant-pages/profile/profile.component';
import { CreateOrderComponent } from '../../restaurant-pages/create-order/create-order.component';
import { registerLocaleData } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import localeFr from '@angular/common/locales/fr';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from 'app/shared/shared.module';

registerLocaleData(localeFr);

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(RestaurantLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxMatSelectSearchModule,
    MatAutocompleteModule,    
    NgSelectModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    OrdersComponent,
    OrderComponent,
    ProductsComponent,
    ProductComponent,
    UpdateProductComponent,
    ImportProductsComponent,
    CreateProductComponent,
    ProfileComponent,
    CreateOrderComponent,
    CreateProductV2Component,
  ]
})

export class RestaurantModule {}