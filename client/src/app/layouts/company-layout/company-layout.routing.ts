import { Routes } from '@angular/router';

import { DashboardComponent } from '../../company-pages/dashboard/dashboard.component';
import { EmployeesComponent } from '../../company-pages/employees/employees.component';
import { UpdateEmployeeComponent } from '../../company-pages/update-employee/update-employee.component';
import { AddEmployeeComponent } from '../../company-pages/add-employee/add-employee.component';
import { OrdersComponent } from '../../company-pages/orders/orders.component';
import { OrderComponent } from '../../company-pages/order/order.component';
import { AuthCompanyGuard } from '../../guard/auth-company.guard';
import { ProfileComponent } from '../../company-pages/profile/profile.component';
import { ProductsComponent } from '../../company-pages/products/products.component';
import { CreateProductComponent } from '../../company-pages/create-product/create-product.component';
import { UpdateProductComponent } from '../../company-pages/update-product/update-product.component';
import { ImportProductsComponent } from '../../company-pages/import-products/import-products.component';
import { ProductComponent } from '../../company-pages/product/product.component';
import { CompanyOrderNewComponent } from 'app/pages/company-order-new/company-order-new.component';

export const CompanyLayoutRoutes: Routes = [
  { path: 'dashboard',      component: DashboardComponent, canActivate:[AuthCompanyGuard] },
  { path: 'employees',     component: EmployeesComponent, canActivate:[AuthCompanyGuard] },
  { path: 'employees/add',     component: AddEmployeeComponent, canActivate:[AuthCompanyGuard] },
  { path: 'employees/:id/edit',     component: UpdateEmployeeComponent, canActivate:[AuthCompanyGuard] },
  { path: 'orders',     component: OrdersComponent, canActivate:[AuthCompanyGuard] },
  { path: 'orders/new',     component: CompanyOrderNewComponent, canActivate:[AuthCompanyGuard] },
  { path: 'orders/:id',     component: OrderComponent, canActivate:[AuthCompanyGuard] },
  { path:'profile', component:ProfileComponent, canActivate:[AuthCompanyGuard]},
  {path:'products', component:ProductsComponent, canActivate:[AuthCompanyGuard] },
  {path:'products/import', component:ImportProductsComponent, canActivate:[AuthCompanyGuard] },
  {path:'products/add', component:CreateProductComponent, canActivate:[AuthCompanyGuard] },
  {path:'products/:id', component:ProductComponent, canActivate:[AuthCompanyGuard] },
  {path:'products/:id/edit', component:UpdateProductComponent, canActivate:[AuthCompanyGuard] },
  
  

]; 