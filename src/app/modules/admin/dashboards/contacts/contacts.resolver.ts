import { ContactService } from "./contacts.service";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { catchError, map, Observable, throwError } from "rxjs";
import { Country } from "./contacts.types";
import { User } from "app/shared/dtos/user";
import { CompanyService } from "../company/company.service";
import { ApiResponse } from "app/shared/global/globals";

@Injectable({
  providedIn: "root",
})
export class ContactsResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(private _contactsService: ContactService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   * @param route
   * @param state
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User[]> {
    return this._contactsService.getContacts();
  }
}

@Injectable({
  providedIn: "root",
})
export class ContactsContactResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(
    private _contactsService: ContactService,
    private _router: Router,
    private _companyService: CompanyService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   * @param route
   * @param state
   */

  // resolve(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<Contact> {
  //   const id = route.paramMap.get("id");
  //   return this._contactsService.getContactById(id).pipe(
  //     catchError((error) => {
  //       console.error(error);
  //       const parentUrl = state.url.split("/").slice(0, -1).join("/");
  //       this._router.navigateByUrl(parentUrl);
  //       return throwError(error);
  //     })
  //   );
  // }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    console.log(route.queryParams)
    if(route.queryParams.userType.toLowerCase() ===  "company" || route.queryParams.userType.toLowerCase() ===  "firma"){
      return this._companyService.getCompanyById(route.paramMap.get("userId")).pipe(
        map((response: ApiResponse) => response.data),
        catchError((error) => {
          console.error(error)

          const parentUrl = state.url.split("/").slice(0,-1).join("/")

          this._router.navigateByUrl(parentUrl)

          return error
        })
      )
    } else {
      return this._contactsService
        .getContactById(route.paramMap.get("userId"))
        .pipe(
          // Error here means the requested contact is not available
          catchError((error) => {
            // Log the error
            console.error(error);
  
            // Get the parent url
            const parentUrl = state.url.split("/").slice(0, -1).join("/");
  
            // Navigate to there
            this._router.navigateByUrl(parentUrl);
  
            // Throw an error
            throw error;
          })
        );
    }
  }
}

@Injectable({
  providedIn: "root",
})
export class ContactsCountriesResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(private _contactsService: ContactService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   * @param route
   * @param state
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Country[]> {
    return this._contactsService.getCountries();
  }
}

// @Injectable({
//     providedIn: 'root'
// })
// export class ContactsTagsResolver implements Resolve<any>
// {
//     /**
//      * Constructor
//      */
//     constructor(private _contactsService: ContactService) {
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Resolver
//      *
//      * @param route
//      * @param state
//      */
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Tag[]> {
//         return this._contactsService.getTags();
//     }
// }
