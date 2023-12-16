import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Globals } from "app/shared/global/globals";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  // private globals = new Globals();
  // private calendarBaseUri: string = this.globals.backendUri + "/calendar";

  constructor(private http: HttpClient) {}
  headers = new HttpHeaders({
    Authorization: "Basic " + btoa("Kawaman" + ":" + "password"),
  });

  postEvent(newEvent: any): Observable<any> {
    return this.http.post("https://85.190.254.23:9443/dav.php/", newEvent, {
      headers: this.headers,
    });
  }

  // username = "Kawaman";
  // password = "password";

  // headers = new HttpHeaders({
  //   Authorization: "Basic " + btoa(this.username + ":" + this.password),
  // });

  // postEvent(newEvent: any, headers: HttpHeaders): Observable<any> {
  //   return this.http.post("https://85.190.254.23:9443/dav.php/", newEvent, {
  //     headers,
  //   });
  // }

  // postEvent(newEvent: any): Observable<any> {
  //   const token = localStorage.getItem("currentToken");
  //   const header = new HttpHeaders().set("Authorization", `Bearer ${token}`);
  //   const url = "https://85.190.254.23:9443/dav.php/";
  //   // this.calendarBaseUri;
  //   return this.http.post(url, newEvent);
  // }
}
