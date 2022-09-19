import { Routes } from '@angular/router';
import { DashboardComponent } from '../../restaurant-pages/dashboard/dashboard.component';
import { AuthRestaurantGuard } from '../../guard/auth-restaurant.guard'
import { OrdersComponent } from '../../restaurant-pages/orders/orders.component';
import { OrderComponent } from '../../restaurant-pages/order/order.component';
import { ProductsComponent } from '../../restaurant-pages/products/products.component';
import { ProductComponent } from '../../restaurant-pages/product/product.component';
import { UpdateProductComponent } from '../../restaurant-pages/update-product/update-product.component';
import { ImportProductsComponent } from '../../restaurant-pages/import-products/import-products.component';
import { CreateProductComponent } from '../../restaurant-pages/create-product/create-product.component';
import { ProfileComponent } from '../../restaurant-pages/profile/profile.component';
import { CreateProductV2Component } from 'app/restaurant-pages/create-product-v2/create-product-v2.component';
import { CompanyOrderNewComponent } from 'app/pages/company-order-new/company-order-new.component';

export const RestaurantLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthRestaurantGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthRestaurantGuard] },
  { path: 'orders/new',     component: CompanyOrderNewComponent, canActivate:[AuthRestaurantGuard] },
  { path: 'orders/:id', component: OrderComponent, canActivate: [AuthRestaurantGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthRestaurantGuard] },
  { path: 'products/import', component: ImportProductsComponent, canActivate: [AuthRestaurantGuard] },
  { path: 'products/new', component: CreateProductV2Component, canActivate: [AuthRestaurantGuard] },
  { path: 'products/add', component: CreateProductComponent, canActivate: [AuthRestaurantGuard] },
  { path: 'products/:id', component: ProductComponent, canActivate: [AuthRestaurantGuard] },
  { path: 'products/:id/edit', component: UpdateProductComponent, canActivate: [AuthRestaurantGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthRestaurantGuard] },

]