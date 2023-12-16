/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  catchError,
  interval,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import { AuthUtils } from "app/core/auth/auth.utils";
import { UserService } from "app/core/user/user.service";
import { Router } from "@angular/router";
import { Globals } from "app/shared/global/globals";
import { AuthRequest } from "app/shared/dtos/auth-request";
import jwt_decode from "jwt-decode";
import { AuthResponse } from "app/shared/dtos/auth-response";
import { User } from "app/shared/dtos/user";

@Injectable()
export class AuthService {
  anonymousLogin(value: any) {
    throw new Error("Method not implemented.");
  }
  private _authenticated: boolean = false;
  private globals = new Globals();
  private authBaseUri: string = this.globals.authUri;
  // private authBaseUri: string = this.globals.backendUri + "/authentication";
  private authScheduler: Observable<any> = interval(1000);
  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService
  ) {
    this.scheduleReAuthentication();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Forgot password
   *
   * @param email
   */
  forgotPassword(email: string): Observable<any> {
    return this._httpClient.put(`${this.authBaseUri}/request-password-reset`, {email});
  }

  /**
   * Reset password
   *
   * @param password
   */
  resetPassword(password: string): Observable<any> {
    return this._httpClient.post("api/auth/reset-password", password);
  }

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(authRequest: AuthRequest): Observable<AuthResponse> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError("User is already logged in.");
    }

    return this._httpClient
      .post<AuthResponse>(`${this.authBaseUri}/auth`, authRequest)
      .pipe(
        tap((authResponse: AuthResponse) => {
          this.setToken(authResponse);

          // Set the authenticated flag to true
          this._authenticated = true;
        })
      );
  }
  /**
   * Check if a valid JWT token is saved in the localStorage
   */
  isLoggedIn(): any {
    return (
      !!this.getToken() &&
      this.getTokenExpirationDate(this.getToken()).valueOf() >
        new Date().valueOf()
    );
  }

  getName(): void {
    if (this.getToken() != null) {
      const decoded: any = jwt_decode(this.getToken());
      const authInfo = decoded.aut;
    }
  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Remove the access token from the local storage
    //this.router.navigate(['login']);
    localStorage.removeItem("currentToken");
    localStorage.removeItem("futureToken");
    localStorage.removeItem("currentUser");

    // Set the authenticated flag to false
    this._authenticated = false;

    // Return the observable
    return of(true);
  }

  /**
   * Sign up
   *
   * @param user
   */
  signUp(user: {
    name: string;
    email: string;
    password: string;
    company: string;
  }): Observable<any> {
    return this._httpClient.post("/auth/sign-up", user);
  }

  getToken(): string {
    return localStorage.getItem("currentToken");
  }

  getFutureToken(): string {
    return localStorage.getItem("futureToken");
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem("currentUser"));
  }

  // getCurrentUserName(): any {
  //     return localStorage.getItem('currentUserName');
  // }

  /**
   * Returns the user role based on the current token
   */
  getUserRole(): string {
    if (this.getToken() != null) {
      const decoded: any = jwt_decode(this.getToken());
      const authInfo = decoded.auth;
      console.log(authInfo);
      if (authInfo && authInfo.includes("ADMIN")) {
        return "ADMIN";
      } else if (authInfo && authInfo.includes("USER")) {
        return "USER";
      }
    }
    return "UNDEFINED";
  }

  // getUserRole(): any {
  //     if (this.getToken() != null) {
  //         const decoded: any = jwt_decode(this.getToken());
  //         const authInfo = decoded.auth;
  //         console.log(authInfo);
  //         if (authInfo.includes('ADMIN')) {
  //             return 'ADMIN';
  //         } else if (authInfo.includes('USER')) {
  //             return 'USER';
  //         }
  //     }
  //     return 'UNDEFINED';
  // }

  private setToken(authResponse: AuthResponse): void {
    console.log("Auth Response:" + JSON.stringify(authResponse));
    localStorage.setItem("currentToken", authResponse.data.token);
    localStorage.setItem("futureToken", authResponse.data.refreshToken);
    if (authResponse.data.user !== null) {
      localStorage.setItem("currentUser", JSON.stringify(authResponse.data.user));
    }
  }

  /**
   * JWT token expires after 10 minutes, therefore a new token will requested 1 minute before the expiration
   */
  private scheduleReAuthentication(): void {
    this.authScheduler.subscribe(() => {
      if (this.isLoggedIn()) {
        const timeLeft =
          this.getTokenExpirationDate(this.getToken()).valueOf() -
          new Date().valueOf();
        if (timeLeft / 1000 < 60) {
          this.reAuthenticate().subscribe({
            next: (token) => {
              console.log("Re-authenticated successfully");
              this.setToken(token);
              return;
            },
            error: (err) => {
              console.log("Could not re-authenticate " + err);
            },
          });
        }
      }
    });
  }

  /**
   * Use futureToken as new token and request a new futureToken
   */
  private reAuthenticate(): Observable<AuthResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: "Bearer " + this.getFutureToken(),
      }),
    };

    return this._httpClient
      .get<AuthResponse>(this.authBaseUri, httpOptions)
      .pipe(tap((authResponse: AuthResponse) => this.setToken(authResponse)));
  }

  private getTokenExpirationDate(token: string): Date {
    const decoded: any = jwt_decode(token);
    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  //   unlockSession(authRequest: AuthRequest): Observable<any>
  //   {
  //       return this._httpClient.post('api/auth/unlock-session', credentials);
  //   }

  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }

    // Check the access token availability
    if (!this.getToken()) {
      return of(false);
    }

    // Check the access token expire date
    if (AuthUtils.isTokenExpired(this.getToken())) {
      return of(false);
    }

    // If the access token exists and it didn't expire, sign in using it
    return of(true);
  }
  anonymousLo;
}
