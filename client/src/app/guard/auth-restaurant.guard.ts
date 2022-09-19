import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthRestaurantGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if(this.auth.loggedIn()) {
      const currentUser = this.auth.getUser();
      if(currentUser.role == "restaurant"){ 
        return true;
       } 
    } else {
      this.auth.redirectUrl = state.url;
      this.router.navigate(['']);
      return false;
    }
  }
  
}
