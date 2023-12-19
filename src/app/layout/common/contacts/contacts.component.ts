/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { UntypedFormControl } from '@angular/forms';
import { Contact } from 'app/layout/common/quick-chat/quick-chat.types';
import { Observable, Subject, filter, takeUntil, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ContactsService } from 'app/layout/common/contacts/contacts.service';
import { ContactTumbComponent } from 'app/modules/admin/dashboards/contact-tumb/contact-tumb.component';

const gridViewClass: string = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full min-w-0 ng-star-inserted';
const listViewClass: string = 'relative';
@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
    @ViewChild('divComponent', { read: ElementRef, static: false }) divComponent: ElementRef;
    contacts: Contact[] = [];
    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedContact: Contact;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _contactsService: ContactsService) { }

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to contact changes
        this._contactsService.getAll()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: Contact[]) => {
                // Load the contacts
                this.contacts = contacts;
                this.contacts.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
                console.log(this.contacts.length);
            });
        /*
        this.aRoutes.paramMap.subscribe((url: any) => {
            console.log(this.contacts);
            console.log(url.params.type);
            if (url.params.type) {
                this.contacts = this.contacts.filter((contact: any) => {
                    if (contact.title === url.params.type) {
                        return contact;
                    }
                });
            }
        });
        */

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Delete the given contact
     */
    /*
    delete(contact: Contact): void
    {
        // Delete the contact
        this._contactsService.delete(contact.id).subscribe();
    }
    */
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    gridViewClicked() {
        this.divComponent.nativeElement.className = gridViewClass;
    }

    listViewClicked() {
        this.divComponent.nativeElement.className = listViewClass;
    }
}
