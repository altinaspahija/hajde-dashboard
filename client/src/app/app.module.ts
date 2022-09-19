import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './others/login/login.component';
import { CompanyLayoutComponent } from './layouts/company-layout/company-layout.component';
import { SidebarCompanyComponent } from './sidebar-company/sidebar-company.component';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './others/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './others/reset-password/reset-password.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { RestaurantLayoutComponent } from './layouts/restaurant-layout/restaurant-layout.component';
import { SidebarRestaurantComponent } from './sidebar-restaurant/sidebar-restaurant.component';
import {FallbackSrc} from "./shared/image/FallbackSrcComponent";
import { VerificationLoginComponent } from "./others/verfication-login/verification-login.component";
import { OptComponent } from './pages/opt/opt.component';
import { ServiceWorkerModule } from '@angular/service-worker';

const config: SocketIoConfig = { url: environment.socketUrl, options: {} };


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    CompanyLayoutComponent,
    SidebarCompanyComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    RestaurantLayoutComponent,
    SidebarRestaurantComponent,
    VerificationLoginComponent,
    FallbackSrc,
    OptComponent
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, { relativeLinkResolution: 'legacy' }),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
