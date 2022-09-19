import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (this.auth.loggedIn()) {
            const loggedinUser = this.auth.getUser();
            if (loggedinUser.role == "admin") {
                this.router.navigate(["/admin/dashboard"]);
            } else if (loggedinUser.role == "company") {
                this.router.navigate(["/company/dashboard"]);
            } else if (loggedinUser.role == "restaurant") {
                this.router.navigate(["/restaurant/dashboard"]);
            }
            return false;
        }
        else {
            return true;
        }
    }

}
