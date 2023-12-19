import { ContactDescriptionComponent } from "./contact-description/contact-description.component";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CanDeactivateContactsDetails
  implements CanDeactivate<ContactDescriptionComponent>
{
  canDeactivate(
    component: ContactDescriptionComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
      nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/contacts'
    // it means we are navigating away from the
    // contacts app
    if (!nextState.url.includes("/contacts")) {
      // Let it navigate
      return true;
    }

    // If we are navigating to another contact...
    if (nextRoute.paramMap.get("id")) {
      // Close the drawer first, and then navigate
      return component.closeDrawer().then(() => true);
    }

    // Otherwise, let it navigate
    return true;
  }
}
