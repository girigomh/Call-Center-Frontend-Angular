import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from "rxjs";
import { catchError } from "rxjs/operators";
import { Country } from "./contacts.types";
import { User } from "app/shared/dtos/user";
import { UserType } from "app/shared/dtos/user_type";
import { Globals } from "app/shared/global/globals";

@Injectable({
  providedIn: "root",
})
export class ContactService {
  private globals = new Globals();
  // Private
  private _contact: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _contacts: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
  private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(
    null
  );
  private objectsBaseUri: string = this.globals.backendUri + "/objects";
  private contactsBaseUri: string = this.globals.backendUri + "/contacts";
  private backendBaseUri: string = this.globals.authUri + '/users'
  getAll: any;
  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for contact
   */
  get contact$(): Observable<User> {
    return this._contact.asObservable();
  }

  /**
   * Getter for contacts
   */
  get contacts$(): Observable<User[]> {
    return this._contacts.asObservable();
  }

  /**
   * Getter for countries
   */
  get countries$(): Observable<Country[]> {
    return this._countries.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get contacts
   */
  getContacts(): Observable<any> {
    const header = new HttpHeaders().set(
      "Authorization",
      `Bearer ${localStorage.getItem("currentToken")}`
    );
    const params = new HttpParams().set("pageSize", "1000");

    return this._httpClient
      .get<any[]>(this.backendBaseUri, { headers: header, })
      .pipe(
        map((response: any) => response.data),
        tap((contacts) => {
          const results = contacts.map((contact) => {
            let birthday = "";
            if (contact.birthday && Array.isArray(contact.birthday)) {
              const [y, m, d, h, mm, s] = contact.birthday;
              birthday = `${y}-${m}-${d} ${h}:${mm}:${s}`;
            }
            return {
              ...contact,
              birthday,
            };
          });
          this._contacts.next(contacts);
          // //console.log("got: "+JSON.stringify(results))
        })
      );
  }

  /**
   * Search contacts with given query
   *
   * @param query
   */
  searchContacts(query: string): Observable<User[]> {
    return this._httpClient
      .get<User[]>("api/apps/contacts/search", {
        params: { query },
      })
      .pipe(
        tap((contacts) => {
          this._contacts.next(contacts);
        })
      );
  }

  /**
   * Get contact by id
   */
  // getContactById(id: string): Observable<User> {
  //   return this._contacts.pipe(
  //     take(1),
  //     map((contacts) => {
  //       //console.log(contacts);
  //       //console.log(id);
  //       // Find the contact
  //       // const contact =
  //       //   contacts.find((item) => item.userId.toString() === id) || null;
  //       const contact =
  //         contacts?.find((item) => item.userId?.toString() === id) || null;

  //       // Update the contact
  //       this._contact.next(contact);

  //       // Return the contact
  //       return contact;
  //     }),
  //     switchMap((contact) => {
  //       if (!contact) {
  //         return throwError("Could not found contact with id of " + id + "!");
  //       }

  //       return of(contact);
  //     })
  //   );
  // }

  getContactById(id: string): Observable<any> {
    return this._contacts.asObservable().pipe(
      take(1),
      map((contacts) => {
        //console.log(contacts);
        //console.log(id);
        // Find the contact
        // const contact =
        //   contacts.find((item) => item.userId.toString() === id) || null;
        const contact =
        contacts?.find((item) => item.userId?.toString() === id) || null;
        console.log(contacts.find((item) => item.userId.toString() === id))
        //console.log("contact: " + JSON.stringify(contact));
        // Update the contact
        // this._contact.next(contact);

        return contact;
      }),
      switchMap((contact:any) => {
        if (contact.userId) {
          return this.getContactData(contact.email);
        }

        // Return the contact
        return of(null);
      }),
      map((contact) => {
        //console.log(contact);
        if (!contact) {
          return throwError("Could not found contact with id of " + id + "!");
        }

        return contact;
      })
    );
  }

  getContactData(email: string) {
    //console.log("about to get user details....");
    const header = new HttpHeaders().set(
      "Authorization",
      `Bearer ${localStorage.getItem("currentToken")}`
    );
    // const url = this.objectsBaseUri + "/" + userId + "/" + userType;

    //console.log("url: " + url);
    return this._httpClient.get<any>(`${this.backendBaseUri}/${email}`, { headers: header }).pipe(
      map((contactData) => contactData.data)
    );
    // const ret = this._httpClient.get<any>(url, { headers: header });
    // .pipe(
    //   map((newContact) => {
    //     // this._contacts.next(newContact);
    //     //console.log(JSON.stringify(newContact)); // Log the modified contact data
    //     // Return the new contact
    //     return newContact;
    //   }),
    // );
    // ret.subscribe((data) => {
    //   //console.log(data);
    // });
    // return ret;
  }
  createContact(contact: any): Observable<User> {
    //const { email, userRole, profilePicture, ...contactData } = contact; // Destructure and remove email and userRole

    const token = localStorage.getItem("currentToken");
    const header = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    // //console.log(header);
    return this._httpClient
      .post<User>(this.objectsBaseUri, contact, { headers: header }) // Use contactData instead of contact
      .pipe(
        map((newContact) => {
          // Update the contacts with the new contact
          const updatedContacts = newContact;
          // this._contacts.next(newContact);
          //console.log(JSON.stringify(newContact)); // Log the modified contact data
          // Return the new contact
          return newContact;
        })
      );
  }

  /**
   * Create contact
   *
   */
  // createContact(contact: any): Observable<User> {
  //   const token = localStorage.getItem("currentToken");
  //   return this.contacts$.pipe(
  //     take(1),
  //     switchMap((contacts) =>
  //       this._httpClient
  //         .post<User>(this.objectsBaseUri, {
  //           headers: {
  //             // eslint-disable-next-line @typescript-eslint/naming-convention
  //             Authorization: "Bearer " + token,
  //           },
  //         })
  //         .pipe(
  //           map((newContact) => {
  //             // Update the contacts with the new contact
  //             const contact: User = {
  //               ...newContact,
  //               userId: number(newContact.userId),
  //             };
  //             this._contacts.next([contact, ...contacts]);

  //             // Return the new contact
  //             return contact;
  //           })
  //         )
  //     )
  //   );
  // }

  /**
   * Update contact
   *
   * @param id
   * @param contact
   */
  // updateContact(id: number, contact: User): Observable<User> {
  //   return this.contacts$.pipe(
  //     take(1),
  //     switchMap((contacts) =>
  //       this._httpClient
  //         .patch<User>("api/apps/contacts/contact", {
  //           id,
  //           contact,
  //         })
  //         .pipe(
  //           map((updatedContact) => {
  //             //console.log(updatedContact);
  //             // Find the index of the updated contact
  //             const index = contacts.findIndex((item) => item.userId === id);

  //             // // Update the contact
  //             contacts[index] = updatedContact;

  //             // // Update the contacts
  //             this._contacts.next(contacts);

  //             // Return the updated contact
  //             return updatedContact;
  //           }),
  //           switchMap((updatedContact) =>
  //             this.contact$.pipe(
  //               take(1),
  //               filter((item) => item && item.userId === id),
  //               tap(() => {
  //                 // Update the contact if it's selected
  //                 this._contact.next(updatedContact);

  //                 // Return the updated contact
  //                 return updatedContact;
  //               })
  //             )
  //           )
  //         )
  //     )
  //   );
  // }

  // ...

  updateContact(id: number, contact: User): Observable<User> {
    return this.contacts$.pipe(
      take(1),
      switchMap((contacts) => {
        // Check if 'contacts' is null
        if (!contacts) {
          console.error("The 'contacts' array is null.");
          // Return an appropriate value or throw an error based on your requirements
          // For example, you can return an empty user object or throw an error
          // return of({} as User);
          return throwError("The 'contacts' array is null.");
        }

        return this._httpClient
          .patch<User>("api/apps/contacts/contact", {
            id,
            contact,
          })
          .pipe(
            map((updatedContact) => {
              //console.log(updatedContact);
              // Find the index of the updated contact
              const index = contacts.findIndex((item) => item.userId === id);

              // Update the contact
              contacts[index] = updatedContact;

              // Update the contacts
              this._contacts.next(contacts);

              // Return the updated contact
              return updatedContact;
            }),
            switchMap((updatedContact) =>
              this.contact$.pipe(
                take(1),
                filter((item) => item && item.userId === id),
                tap(() => {
                  // Update the contact if it's selected
                  this._contact.next(updatedContact);

                  // Return the updated contact
                  return updatedContact;
                })
              )
            )
          );
      })
    );
  }

  /**
   * Delete the contact
   *
   * @param id
   */
  deleteContact(id: number): Observable<boolean> {
    return this.contacts$.pipe(
      take(1),
      switchMap((contacts) =>
        this._httpClient
          .delete("api/apps/contacts/contact", { params: { id } })
          .pipe(
            map((isDeleted: boolean) => {
              // Find the index of the deleted contact
              const index = contacts.findIndex((item) => item.userId === id);

              // Delete the contact
              contacts.splice(index, 1);

              // Update the contacts
              this._contacts.next(contacts);

              // Return the deleted status
              return isDeleted;
            })
          )
      )
    );
  }

  /**
   * Get countries
   */
  getCountries(): Observable<Country[]> {
    return this._httpClient.get<Country[]>("api/apps/contacts/countries").pipe(
      tap((countries) => {
        this._countries.next(countries);
      })
    );
  }

  /**
   * Get tags
   */
  // getTags(): Observable<Tag[]> {
  // return this._httpClient.get<Tag[]>("api/apps/contacts/tags").pipe(
  //   tap((tags) => {
  //     //console.log(tags, "Tags");
  //     this._tags.next(tags);
  //   })
  // );
  // }

  /**
   * Create tag
   *
   * @param tag
   */
  // createTag(tag: Tag): Observable<Tag> {
  //   return this.tags$.pipe(
  //     take(1),
  //     switchMap((tags) =>
  //       this._httpClient.post<Tag>("api/apps/contacts/tag", { tag }).pipe(
  //         map((newTag) => {
  //           // Update the tags with the new tag
  //           this._tags.next([...tags, newTag]);

  //           // Return new tag from observable
  //           return newTag;
  //         })
  //       )
  //     )
  //   );
  // }

  /**
   * Update the tag
   *
   * @param id
   * @param tag
   */
  // updateTag(id: number, tag: Tag): Observable<Tag> {
  //   return this.tags$.pipe(
  //     take(1),
  //     switchMap((tags) =>
  //       this._httpClient
  //         .patch<Tag>("api/apps/contacts/tag", {
  //           id,
  //           tag,
  //         })
  //         .pipe(
  //           map((updatedTag) => {
  //             // Find the index of the updated tag
  //             const index = tags.findIndex((item) => item.userId === id);

  //             // Update the tag
  //             tags[index] = updatedTag;

  //             // Update the tags
  //             this._tags.next(tags);

  //             // Return the updated tag
  //             return updatedTag;
  //           })
  //         )
  //     )
  //   );
  // }

  /**
   * Delete the tag
   *
   * @param id
   */
  // deleteTag(id: number): Observable<boolean> {
  //   return this.tags$.pipe(
  //     take(1),
  //     switchMap((tags) =>
  //       this._httpClient
  //         .delete("api/apps/contacts/tag", { params: { id } })
  //         .pipe(
  //           map((isDeleted: boolean) => {
  //             // Find the index of the deleted tag
  //             const index = tags.findIndex((item) => item.userId === id);

  //             // Delete the tag
  //             tags.splice(index, 1);

  //             // Update the tags
  //             this._tags.next(tags);

  //             // Return the deleted status
  //             return isDeleted;
  //           }),
  //           filter((isDeleted) => isDeleted),
  //           switchMap((isDeleted) =>
  //             this.contacts$.pipe(
  //               take(1),
  //               map((contacts) => {
  //                 // Iterate through the contacts
  //                 contacts.forEach((contact) => {
  //                   const tagIndex = contact.tags.findIndex(
  //                     (tag) => tag === id
  //                   );

  //                   // If the contact has the tag, remove it
  //                   if (tagIndex > -1) {
  //                     contact.tags.splice(tagIndex, 1);
  //                   }
  //                 });

  //                 // Return the deleted status
  //                 return isDeleted;
  //               })
  //             )
  //           )
  //         )
  //     )
  //   );
  // }

  /**
   * Update the avatar of the given contact
   *
   * @param id
   * @param avatar
   */
  uploadAvatar(id: number, avatar: File): Observable<User> {
    return this.contacts$.pipe(
      take(1),
      switchMap((contacts) =>
        this._httpClient
          .post<User>(
            "api/apps/contacts/avatar",
            {
              id,
              avatar,
            },
            {
              headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "Content-Type": avatar.type,
              },
            }
          )
          .pipe(
            map((updatedContact) => {
              // Find the index of the updated contact
              const index = contacts?.findIndex((item) => item.userId === id);

              // Update the contact
              if (contacts && index !== -1) {
                // Update the contact
                contacts[index] = updatedContact;
                // Update the contacts
                this._contacts.next(contacts);
              }
              // contacts[index] = updatedContact;
              // Update the contacts
              // this._contacts.next(contacts);

              // Return the updated contact
              return updatedContact;
            }),
            switchMap((updatedContact) =>
              this.contact$.pipe(
                take(1),
                filter((item) => item && item.userId === id),
                tap(() => {
                  // Update the contact if it's selected
                  this._contact.next(updatedContact);

                  // Return the updated contact
                  return updatedContact;
                })
              )
            )
          )
      )
    );
  }
}
