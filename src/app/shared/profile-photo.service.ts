// profile-data.service.ts

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Globals } from "./global/globals";

@Injectable({
  providedIn: "root",
})
export class ProfileDataService {
  // private userDataKey = "user";
  private globals = new Globals();
  private userBaseUri: string = this.globals.backendUri + "/users";
  // private userInfo = "/api/v1/users";

  constructor(private http: HttpClient) {}
  getUserData(): Observable<any> {
    const header = new HttpHeaders().set(
      "Authorization",
      `Bearer ${localStorage.getItem("currentToken")}`
    );
    // const params = new HttpParams().set("", "");
    return this.http.get<any>(this.userBaseUri, {
      headers: header,
      // params: params,
    });
  }

  setUserData(userData: any): Observable<any> {
    const token = localStorage.getItem("currentToken");
    const header = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.post<any>(this.userBaseUri, userData, {
      headers: header,
    });
  }
}
