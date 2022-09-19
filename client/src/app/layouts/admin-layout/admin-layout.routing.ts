import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UsersComponent } from '../../pages/users/users.component';
import { AddUserComponent } from '../../pages/add-user/add-user.component';
import { UpdateUserComponent } from '../../pages/update-user/update-user.component';
import { CompaniesComponent } from '../../pages/companies/companies.component';
import { CreateCompanyComponent } from '../../pages/create-company/create-company.component';
import { EditCompanyComponent } from '../../pages/edit-company/edit-company.component';
import { CompanyComponent } from '../../pages/company/company.component';
import { OrdersComponent } from '../../pages/orders/orders.component';
import { OrderComponent } from '../../pages/order/order.component';
import { AuthAdminGuard } from "../../guard/auth-admin.guard";
import { CouriersComponent } from '../../pages/couriers/couriers.component';
import { CourierComponent } from '../../pages/courier/courier.component';
import { AddCourierComponent } from '../../pages/add-courier/add-courier.component';
import { ProfileComponent } from '../../pages/profile/profile.component';
import { ProductComponent } from '../../pages/product/product.component';
import { CourierStatisticComponent } from '../../pages/courier-statistic/courier-statistic.component';
import { ImportProductsComponent } from '../../pages/import-products/import-products.component';
import { CreateOrderComponent } from '../../administrator/create-order/create-order.component';
import { RestaurantsComponent } from '../../pages/restaurants/restaurants.component';
import { CreateRestaurantComponent } from '../../pages/create-restaurant/create-restaurant.component';
import { UpdateRestaurantComponent } from '../../pages/update-restaurant/update-restaurant.component';
import { RestaurantComponent } from '../../pages/restaurant/restaurant.component';
import { MenuProductComponent } from '../../pages/menu-product/menu-product.component';
import { ImportMenusComponent } from '../../pages/import-menus/import-menus.component';
import { OffersComponent } from '../../pages/offers/offers.component';
import { CreateOfferComponent } from '../../pages/create-offer/create-offer.component';
import { BannersComponent } from '../../pages/banners/banners.component';
import { CategoriesComponent } from '../../pages/categories/categories.component';
import { NotificationComponent } from '../../pages/notification/notification.component';
import { CreateCategoryComponent } from '../../pages/create-category/create-category.component';
import { UpdateCategoryComponent } from '../../pages/update-category/update-category.component';
import { BannerComponent } from '../../pages/banner/banner.component';
import { CreateBannerComponent } from '../../pages/create-banner/create-banner.component';
import { UpdateBannerComponent } from '../../pages/update-banner/update-banner.component';
import { UpdateOfferComponent } from '../../pages/update-offer/update-offer.component';
import { CreateSubcategoriesRestaurantsComponent } from 'app/pages/restaurants-create-subcategories/create-subcategories.component';
import { CreateSubcategoriesCompaniesComponent } from 'app/pages/companies-create-subcategories/create-subcategories.component';
import { CountriesComponent } from 'app/pages/countries/countries.component';
import { CreateCountryComponent } from 'app/pages/create-country/create-country.component';
import { EditCountryComponent } from 'app/pages/edit-country/edit-country.component';
import { CountryComponent } from 'app/pages/country/country.component';
import { GeolocationsComponent } from 'app/pages/geolocations/geolocations.component';
import { CreateGeolocationComponent } from 'app/pages/create-geolocation/create-geolocation.component';
import { EditGeolocationComponent } from 'app/pages/edit-geolocation/edit-geolocation.component';

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
import { CompanyOrderNewComponent } from 'app/pages/company-order-new/company-order-new.component';

import { ListComponent as ZoneListComponent } from 'app/pages/zones/list/list.component';
import { CreateComponent as ZoneCreateComponent } from 'app/pages/zones/create/create.component';
import { EditComponent as ZoneEditComponent } from 'app/pages/zones/edit/edit.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthAdminGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthAdminGuard] },
    { path: 'users/create', component: AddUserComponent, canActivate: [AuthAdminGuard] },
    { path: 'users/:id', component: UpdateUserComponent, canActivate: [AuthAdminGuard] },
    { path: 'companies', component: CompaniesComponent, canActivate: [AuthAdminGuard] },
    { path: 'restaurants', component: RestaurantsComponent, canActivate: [AuthAdminGuard] },
    { path: 'restaurants/create', component: CreateRestaurantComponent, canActivate: [AuthAdminGuard] },
    { path: 'restaurants/:id/create-subcategories', component: CreateSubcategoriesRestaurantsComponent, canActivate: [AuthAdminGuard] },
    { path: 'restaurants/:id', component: RestaurantComponent, canActivate: [AuthAdminGuard] },
    { path: 'restaurants/:id/edit', component: UpdateRestaurantComponent, canActivate: [AuthAdminGuard] },
    { path: 'restaurants/:id/products/:productId', component: MenuProductComponent, canActivate: [AuthAdminGuard] },
    { path: 'restaurants/:id/import', component: ImportMenusComponent, canActivate: [AuthAdminGuard] },
    { path: 'companies/:id/create-subcategories', component: CreateSubcategoriesCompaniesComponent, canActivate: [AuthAdminGuard] },
    { path: 'companies/create', component: CreateCompanyComponent, canActivate: [AuthAdminGuard] },
    { path: 'companies/:id/edit', component: EditCompanyComponent, canActivate: [AuthAdminGuard] },
    { path: 'companies/:id', component: CompanyComponent, canActivate: [AuthAdminGuard] },
    { path: 'companies/:id/import', component: ImportProductsComponent, canActivate: [AuthAdminGuard] },
    { path: 'companies/:id/products/:productId', component: ProductComponent, canActivate: [AuthAdminGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [AuthAdminGuard] },
    { path: 'orders/create', component: CompanyOrderNewComponent, canActivate:[AuthAdminGuard] },
    { path: 'orders/:id', component: OrderComponent, canActivate: [AuthAdminGuard] },
    { path: 'couriers', component: CouriersComponent, canActivate: [AuthAdminGuard] },
    { path: 'couriers/create', component: AddCourierComponent, canActivate: [AuthAdminGuard] },
    { path: 'couriers/:id', component: CourierStatisticComponent, canActivate: [AuthAdminGuard] },
    { path: 'couriers/:id/edit', component: CourierComponent, canActivate: [AuthAdminGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthAdminGuard] },
    { path: 'offers', component: OffersComponent, canActivate: [AuthAdminGuard] },
    { path: 'offers/create', component: CreateOfferComponent, canActivate: [AuthAdminGuard] },
    { path: 'offers/:id', component: UpdateOfferComponent, canActivate: [AuthAdminGuard] },
    { path: 'banners', component: BannersComponent, canActivate: [AuthAdminGuard] },
    { path: 'categories', component: CategoriesComponent, canActivate: [AuthAdminGuard] },
    { path: 'notification', component: NotificationComponent, canActivate: [AuthAdminGuard] },
    { path: 'categories/create', component: CreateCategoryComponent, canActivate: [AuthAdminGuard] },
    { path: 'categories/:id/edit', component: UpdateCategoryComponent, canActivate: [AuthAdminGuard] },
    { path: 'banners/create', component: CreateBannerComponent, canActivate: [AuthAdminGuard] },
    { path: 'banners/:id', component: BannerComponent, canActivate: [AuthAdminGuard] },
    { path: 'banners/:id/edit', component: UpdateBannerComponent, canActivate: [AuthAdminGuard] },

    { path: 'countries', component: CountriesComponent, canActivate: [AuthAdminGuard] },
    { path: 'countries/create', component: CreateCountryComponent, canActivate: [AuthAdminGuard] },
    { path: 'countries/:id', component: CountryComponent, canActivate: [AuthAdminGuard] },
    { path: 'countries/:id/edit', component: EditCountryComponent, canActivate: [AuthAdminGuard] },

    { path: 'geolocations', component: GeolocationsComponent, canActivate: [AuthAdminGuard] },
    { path: 'geolocations/create', component: CreateGeolocationComponent, canActivate: [AuthAdminGuard] },
    { path: 'geolocations/:id/edit', component: EditGeolocationComponent, canActivate: [AuthAdminGuard] },

    { path: 'target-groups', component: TargetGroupListComponent, canActivate: [AuthAdminGuard] },
    { path: 'target-groups/create', component: TargetGroupCreateComponent, canActivate: [AuthAdminGuard] },
    { path: 'target-groups/:id', component: TargetGroupViewComponent, canActivate: [AuthAdminGuard] },
    { path: 'target-groups/:id/edit', component: TargetGroupUpdateComponent, canActivate: [AuthAdminGuard] },

    { path: 'product-limitations', component: ProductLimitationListComponent, canActivate: [AuthAdminGuard] },
    { path: 'product-limitations/create', component: ProductLimitationCreateComponent, canActivate: [AuthAdminGuard] },
    { path: 'product-limitations/:id', component: ProductLimitationViewComponent, canActivate: [AuthAdminGuard] },
    { path: 'product-limitations/:id/edit', component: ProductLimitationUpdateComponent, canActivate: [AuthAdminGuard] },

    { path: 'auth-users', component: AuthUserListComponent, canActivate: [AuthAdminGuard] },
    { path: 'auth-users/create', component: AuthUserCreateComponent, canActivate: [AuthAdminGuard] },
    { path: 'auth-users/:id', component: AuthUserViewComponent, canActivate: [AuthAdminGuard] },
    { path: 'auth-users/:id/edit', component: AuthUserUpdateComponent, canActivate: [AuthAdminGuard] },

    { path: 'zones', component: ZoneListComponent, canActivate: [AuthAdminGuard] },
    { path: 'zones/create', component: ZoneCreateComponent, canActivate: [AuthAdminGuard] },
    { path: 'zones/:id/edit', component: ZoneEditComponent, canActivate: [AuthAdminGuard] },
];
