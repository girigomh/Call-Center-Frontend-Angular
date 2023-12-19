import { HttpHeaders } from '@angular/common/http';
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, tap, of, BehaviorSubject } from 'rxjs';
import { OnlineStatus } from 'app/core/user/user.types';
import { User } from 'app/shared/dtos/user';
import { UserType, UserTypeClass } from 'app/shared/dtos/user_type';
import { ChangePasswordRequest } from 'app/shared/dtos/change-password-request';
import { Globals } from 'app/shared/global/globals';
import { WebSocketSubject } from 'rxjs/webSocket';
import { RegisterUserSchema } from 'app/shared/dtos/RegisterUser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private onlineStatusSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public onlineStatus$: Observable<boolean> =
    this.onlineStatusSubject.asObservable();
  private ws$: WebSocketSubject<any>;
  header = new HttpHeaders().set(
    'Authorization',
    'Bearer ' + localStorage.getItem('currentToken')
  );

  companyList: any[];
  private globals = new Globals();
  public _user: ReplaySubject<User> = new ReplaySubject<User>(1);
  public authBaseUri: string = this.globals.authUri;
  private userBaseUri: string = this.globals.backendUri + '/users';
  private objectsBaseUri: string = this.globals.backendUri + '/objects';
  private userTypesBaseUri: string = this.globals.backendUri + '/types';
  private verifyBaseUri: string = this.globals.backendUri + '/verify';
  private blockedUserBaseUri: string = this.userBaseUri + '/blocked';
  private unblockUserBaseUri: string = this.blockedUserBaseUri + '/unblock';
  private passWordChangeBaseUri: string = this.userBaseUri + '/password';

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
    // Replace the backendUri with the actual WebSocket server URL
    // this.ws$ = new WebSocketSubject<any>("EXPECTING A URL FROM THE BACKEND");
    // Subscribe to WebSocket messages to receive updates
    // this.ws$.subscribe((message) => {
    //   // Handle online status update message from the server
    //   if (message.type === "online_status_update") {
    //     this.updateOnlineStatus(message.isOnline);
    //   }
    // });
  }

  // Method to update the online status
  // private updateOnlineStatus(isOnline: boolean): void {
  //   this.onlineStatusSubject.next(isOnline);
  // }
  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for user
   *
   * @param value
   */
  set user(value: User) {
    // Store the value
    this._user.next(value);
  }

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get the current logged in user data
   */
  get(): Observable<User> {
    // return this._httpClient.get<User>('api/common/user').pipe(
    //     tap((user) => {
    //         this._user.next(user);
    //     })
    // );
    return of(JSON.parse(localStorage.getItem('currentUser')));
  }

  /**
   * Update the user
   *
   * @param user
   */
  update(user: User): Observable<any> {
    return this._httpClient.patch<User>('api/common/user', { user }).pipe(
      map((response) => {
        this._user.next(response);
      })
    );
  }

  /**
   * Loads all users from the backend, or users that have 'username' in their username, if username !== null
   *
   * @param username string to search by
   * @param page the number of the requested page
   */
  getUsers(username: string, page: number): Observable<User[]> {
    return this._httpClient.get<User[]>(this.userBaseUri, {
      params: { username: username, page: page.toString() },
    });
  }

  /**
   * Loads all blocked users from the backend, or blocked users that have 'username' in their username, if username !== null
   *
   * @param username string to search by
   * @param page the number of the requested page
   */
  getBlockedUsers(username: string, page: number): Observable<User[]> {
    // console.log("Get blocked users");
    return this._httpClient.get<User[]>(this.blockedUserBaseUri, {
      params: { username: username, page: page.toString() },
    });
  }

  /**
   * unblocks the specified user
   *
   * @param userId id of an user
   */
  unblockUser(userId: number): Observable<any> {
    // console.log("unblocking user with id " + userId);
    return this._httpClient.put(this.unblockUserBaseUri + '/' + userId, null);
  }

  blockUser(userId: number): Observable<any> {
    // console.log("blocking user with id " + userId);
    return this._httpClient.put(this.blockedUserBaseUri + '/' + userId, null);
  }

  /**
   * Loads specific user from the backend
   *
   * @param userId of user to load
   */
  getUserById(user: User): Observable<any> {
    // console.log("Load user details for " + JSON.stringify(user));
    // console.log("User type: " + user.userType);
    const token: any = localStorage.getItem('currentToken');

    return this._httpClient.get<User>(
      this.objectsBaseUri + '/' + user.userId + '/' + user.userType,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }

  /**
   * Persists user to the backend
   *
   * @param user to persist
   */
  createUser(user: RegisterUserSchema): Observable<any> {
    // console.log("Create user with username ", user);
    const token: any = localStorage.getItem('cuurentToken');
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('status', 'online');
    console.log(user.role);
    return this._httpClient.post(
      `${this.authBaseUri}/${user.role}/register`,
      user
    );
    // return this._httpClient.post<User>(this.userBaseUri, user, {
    //   headers: {
    //     // eslint-disable-next-line @typescript-eslint/naming-convention
    //     Authorization: 'Bearer ' + token,
    //   },
    // });
  }

  /**
   * Deletes the user with the specified id
   *
   * @param userId id of user to delete
   */
  deleteUser(userId: number): Observable<any> {
    // console.log("Delete user with id " + userId);
    return this._httpClient.delete(this.userBaseUri + '/' + userId);
  }

  /**
   * Changes the password of a user (sender has to be admin and only passwords of not-admin users can be changed
   *
   * @param changePasswordRequest a request containing the id, the username and the new password
   */
  changePassword(
    changePasswordRequest: ChangePasswordRequest
  ): Observable<any> {
    // console.log("Change Password for user" + changePasswordRequest.username);
    // console.log("POST" + this.passWordChangeBaseUri);
    return this._httpClient.post<ChangePasswordRequest>(
      this.passWordChangeBaseUri,
      changePasswordRequest
    );
  }

  getUserTypes(): Observable<UserTypeClass[]> {
    // console.log("Getting user types");
    return this._httpClient.get<UserTypeClass[]>(this.userTypesBaseUri);
  }

  // getCompanyList(): Observable<any[]> {
  //   console.log("Getting company list");
  //   return this._httpClient.get<any[]>(
  //     "https://localhost:8443/api/v1/contacts?userTypes=Company"
  //   );
  // }
  getCompanyList(): Observable<any[]> {
    console.log('Getting company list');
    const token: any = localStorage.getItem('currentToken');
    return this._httpClient
      .get<any[]>('https://localhost:8443/api/v1/contacts?userTypes=Company', {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: 'Bearer ' + token,
        },
      })
      .pipe(
        tap((response: any[]) => {
          this.companyList = response;
        })
      );
  }

  verifyCaptcha(token: string): any {
    console.log('verifyCaptcha: ' + token);
    return this._httpClient.post<string>(this.verifyBaseUri, token);
  }
  wheather(location: any): any {
    // eslint-disable-next-line quotes
    return this._httpClient.get<any>(
      `https://api.weatherapi.com/v1/current.json?key=f79fa89d92c94f78bda120119231602&q=${location}&aqi=no`
    );
  }

  editUserAddress(addressData: {
    houseNo: string;
    street: string;
    location: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  }) {
    return this._httpClient.put(
      `${this.authBaseUri}/users/address`,
      addressData,
      { headers: this.header }
    );
  }
}
