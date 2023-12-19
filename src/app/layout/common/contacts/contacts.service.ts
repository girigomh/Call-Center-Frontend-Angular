import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, switchMap, take, tap, of } from 'rxjs';
import { Contact } from 'app/layout/common/contacts/contacts.types';
import { contacts } from 'app/mock-api/apps/chat/data';

@Injectable({
    providedIn: 'root'
})
export class ContactsService
{
    getContacts() {
      throw new Error('Method not implemented.');
    }
    private _contacts: Observable<Contact[]>;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    //constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for notifications
     */
    get contacts$(): Observable<Contact[]>
    {
        return this._contacts;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all contacts
     */
    getAll(): Observable<Contact[]>
    {
        return this._httpClient.get<Contact[]>('api/apps/contacts/all').pipe(
            tap((contacts) => {
                this._contacts = of(contacts);
            })
        );
    }

    /**
     * Create a notification
     *
     * @param contact
     */
    /*
    create(contact: Contact): Observable<Contact>
    {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.post<Contact>('api/common/contacts', {contact}).pipe(
                map((newContact) => {

                    // Update the notifications with the new notification
                    this._contacts.push(newContact);

                    // Return the new notification from observable
                    return newContact;
                })
            ))
        );
    }
    */
    /**
     * Update the notification
     *
     * @param id
     * @param contact
     */
    /*
    update(id: string, contact: Contact): Observable<Contact>
    {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.patch<Contact>('api/common/contacts', {
                id,
                contact
            }).pipe(
                map((updatedContact: Contact) => {

                    // Find the index of the updated notification
                    const index = contacts.findIndex(item => item.id === id);

                    // Update the notification
                    contacts[index] = updatedContact;

                    // Update the notifications
                    this._contacts = contacts;

                    // Return the updated notification
                    return updatedContact;
                })
            ))
        );
    }
    */
    /**
     * Delete the notification
     *
     * @param id
     */
    /*
    delete(id: string): Observable<boolean>
    {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.delete<boolean>('api/common/contacts', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted notification
                    const index = contacts.findIndex(item => item.id === id);

                    // Delete the notification
                    contacts.splice(index, 1);

                    // Update the contacts
                    this._contacts = contacts;

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }
    */
}
