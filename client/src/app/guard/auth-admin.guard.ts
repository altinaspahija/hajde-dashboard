import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {
      if(this.auth.loggedIn()) {
        const currentUser = this.auth.getUser();
        if(currentUser.role == "admin"){ 
         return true;
        } 
        this.router.navigate(['']);
        return false;
      } else {
        this.auth.redirectUrl = state.url;
        this.router.navigate(['']);
        return false;
      }
  }
  
}
