import { featchUserRole } from './../../mock-api/common/navigation/check';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {
    public anonymousPaths = ['/dashboard', '/dashboard/files'];
    constructor(
        private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
          const userRole = featchUserRole(); // Assuming this function retrieves the user role

          if (
            featchUserRole() === "ANONYMOUS" &&
            this.anonymousPaths.includes(window.location.pathname)
          ) {
            this.router.navigate(["/dashboard/call"]);
          }
          if (featchUserRole() === "ANONYMOUS") {
            this.router.navigate(["/dashboard/call"]);
            return false;
          }

          if (route.data.roles && !route.data.roles.includes(userRole)) {
            // User role doesn't match the required roles for this route
            this.router.navigate(["/dashboard/call"]); // Redirect to a different page or handle unauthorized access
            return false;
          }
          return true;
        }

}
