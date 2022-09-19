import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UsersComponent } from '../../pages/users/users.component';
import { UpdateUserComponent } from '../../pages/update-user/update-user.component';
import { CompaniesComponent } from '../../pages/companies/companies.component';
import { CreateCompanyComponent } from '../../pages/create-company/create-company.component';
import { EditCompanyComponent } from '../../pages/edit-company/edit-company.component';
import { CompanyComponent } from '../../pages/company/company.component';
import { OrdersComponent } from '../../pages/orders/orders.component';
import { OrderComponent } from '../../pages/order/order.component';
import { CouriersComponent } from '../../pages/couriers/couriers.component';
import { CourierComponent } from '../../pages/courier/courier.component';
import { AddCourierComponent } from '../../pages/add-courier/add-courier.component';
import { ProfileComponent } from '../../pages/profile/profile.component';
import { ProductComponent } from '../../pages/product/product.component';
import { CourierStatisticComponent } from '../../pages/courier-statistic/courier-statistic.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrinterModule } from 'ngx-printer';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { registerLocaleData } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImportProductsComponent } from '../../pages/import-products/import-products.component';
import { CreateOrderComponent } from '../../administrator/create-order/create-order.component';
import { CreateRestaurantComponent } from '../../pages/create-restaurant/create-restaurant.component';
import { RestaurantsComponent } from '../../pages/restaurants/restaurants.component';
import { UpdateRestaurantComponent } from '../../pages/update-restaurant/update-restaurant.component';
import { RestaurantComponent } from '../../pages/restaurant/restaurant.component'
import { MenuProductComponent } from '../../pages/menu-product/menu-product.component';
import localeFr from '@angular/common/locales/fr';
import { ImportMenusComponent } from '../../pages/import-menus/import-menus.component';
import { OffersComponent } from '../../pages/offers/offers.component';
import { OfferComponent } from '../../pages/offer/offer.component';
import { CreateOfferComponent } from '../../pages/create-offer/create-offer.component';
import { BannersComponent } from '../../pages/banners/banners.component';
import { CategoriesComponent } from '../../pages/categories/categories.component';
import { NotificationComponent } from '../../pages/notification/notification.component';
import { BannerComponent } from '../../pages/banner/banner.component';
import { CreateBannerComponent } from '../../pages/create-banner/create-banner.component';
import { CreateCategoryComponent } from '../../pages/create-category/create-category.component';
import { UpdateCategoryComponent } from '../../pages/update-category/update-category.component';
import { UpdateBannerComponent } from '../../pages/update-banner/update-banner.component';
import { UpdateOfferComponent } from '../../pages/update-offer/update-offer.component';
import { CreateSubcategoriesRestaurantsComponent } from '../../pages/restaurants-create-subcategories/create-subcategories.component';
import { CreateSubcategoriesCompaniesComponent } from '../../pages/companies-create-subcategories/create-subcategories.component';
import { CurrencyComponent } from 'app/shared/currency/currency.component';
import { CountryComponent } from 'app/pages/country/country.component';
import { CreateCountryComponent } from 'app/pages/create-country/create-country.component';
import { EditCountryComponent } from 'app/pages/edit-country/edit-country.component';
import { CountriesComponent } from 'app/pages/countries/countries.component';
import { EditGeolocationComponent } from 'app/pages/edit-geolocation/edit-geolocation.component';
import { CreateGeolocationComponent } from 'app/pages/create-geolocation/create-geolocation.component';
import { GeolocationsComponent } from 'app/pages/geolocations/geolocations.component';
import { SpinnerComponent } from 'app/shared/spinner/spinner.component';

import { ListComponent as TargetGroupListComponent } from 'app/pages/target-group/list/list.component';
import { CreateComponent as TargetGroupCreateComponent } from 'app/pages/target-group/create/create.component';
import { UpdateComponent as TargetGroupUpdateComponent } from 'app/pages/target-group/update/update.component';
import { ViewComponent as TargetGroupViewComponent } from 'app/pages/target-group/view/view.component';

import { ListComponent as ProductLimitationListComponent } from 'app/pages/product-limitations/list/list.component';
import { CreateComponent as ProductLimitationCreateComponent } from 'app/pages/product-limitations/create/create.component';
import { EditComponent as ProductLimitationUpdateComponent } from 'app/pages/product-limitations/edit/edit.component';
import { ViewComponent as ProductLimitationViewComponent } from 'app/pages/product-limitations/view/view.component';

import { ListComponent as AuthUserListComponent } from 'app/pages/auth-users/list/list.component';
import { CreateComponent as AuthUserCreateComponent } from 'app/pages/auth-users/create/create.component';
import { EditComponent as AuthUserUpdateComponent } from 'app/pages/auth-users/edit/edit.component';
import { ViewComponent as AuthUserViewComponent } from 'app/pages/auth-users/view/view.component';

import { TargetGroupsSelectComponent } from 'app/shared/target-groups-select/target-groups-select.component';
import { SharedModule } from 'app/shared/shared.module';

import { ListComponent as ZoneListComponent } from 'app/pages/zones/list/list.component';
import { CreateComponent as ZoneCreateComponent } from 'app/pages/zones/create/create.component';
import { EditComponent as ZoneEditComponent } from 'app/pages/zones/edit/edit.component';


registerLocaleData(localeFr);


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxPrinterModule,
    NgxMatSelectSearchModule,
    MatAutocompleteModule,
    NgSelectModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    UsersComponent,
    UpdateUserComponent,
    CompaniesComponent,
    CreateCompanyComponent,
    EditCompanyComponent,
    CompanyComponent,
    OrdersComponent,
    OrderComponent,
    CouriersComponent,
    CourierComponent,
    AddCourierComponent,
    ProfileComponent,
    ProductComponent,
    CourierStatisticComponent,
    ImportProductsComponent,
    CreateOrderComponent,
    CreateRestaurantComponent,
    RestaurantsComponent,
    UpdateRestaurantComponent,
    RestaurantComponent,
    MenuProductComponent,
    ImportMenusComponent,
    OffersComponent,
    OfferComponent,
    CreateOfferComponent,
    BannersComponent,
    CategoriesComponent,
    NotificationComponent,
    BannerComponent,
    CreateBannerComponent,
    CreateCategoryComponent,
    UpdateCategoryComponent,
    UpdateBannerComponent,
    UpdateOfferComponent,
    CreateSubcategoriesRestaurantsComponent,
    CreateSubcategoriesCompaniesComponent,
    CurrencyComponent,
    CountriesComponent,
    CreateCountryComponent,
    EditCountryComponent,
    CountryComponent,
    GeolocationsComponent,
    CreateGeolocationComponent,
    EditGeolocationComponent,
    SpinnerComponent,
    TargetGroupsSelectComponent,
    TargetGroupListComponent,
    TargetGroupCreateComponent,
    TargetGroupUpdateComponent,
    TargetGroupViewComponent,

    ProductLimitationViewComponent,
    ProductLimitationListComponent,
    ProductLimitationCreateComponent,
    ProductLimitationUpdateComponent,

    AuthUserViewComponent,
    AuthUserListComponent,
    AuthUserCreateComponent,
    AuthUserUpdateComponent,

    ZoneListComponent,
    ZoneCreateComponent,
    ZoneEditComponent
  ]
})

export class AdminLayoutModule { }
