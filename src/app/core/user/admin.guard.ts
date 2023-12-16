import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { featchUserRole } from "./../../mock-api/common/navigation/check";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userRole = featchUserRole();
    if (userRole === "ADMIN") {
      return true;
    } else {
      this.router.navigate(["/"]);
      return false;
    }
  }
}
