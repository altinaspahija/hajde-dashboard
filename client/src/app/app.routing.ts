import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { CompanyLayoutComponent} from './layouts/company-layout/company-layout.component';
import { LoginComponent } from './others/login/login.component';
import { ForgotPasswordComponent } from './others/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './others/reset-password/reset-password.component';
import { RestaurantLayoutComponent } from './layouts/restaurant-layout/restaurant-layout.component';
import { VerificationLoginComponent } from './others/verfication-login/verification-login.component';
import { AuthGuard } from './guard/auth.guard';
import { OptComponent } from './pages/opt/opt.component';


export const AppRoutes: Routes = [
  {
    path:'',
    component:LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'verification-login',
    component:VerificationLoginComponent
  },
  {
    path:'setup-opt',
    component:OptComponent
  },
  {
    path:'forgot-password',
    component:ForgotPasswordComponent
  },
  {
    path:'reset-password/:token',
    component:ResetPasswordComponent
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
        {
          path: '',
          loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
        }
    ]
  },
  {
    path: 'company',
    component: CompanyLayoutComponent,
    children: [
        {
          path: '',
          loadChildren: () => import('./layouts/company-layout/company-layout.module').then(m => m.CompanyLayoutModule)
        }
    ]
  },
  {
    path: 'restaurant',
    component: RestaurantLayoutComponent,
    children: [
        {
          path: '',
          loadChildren: () => import('./layouts/restaurant-layout/restaurant-layout.module').then(m => m.RestaurantModule)
        }
    ]
  },
  

  
]
