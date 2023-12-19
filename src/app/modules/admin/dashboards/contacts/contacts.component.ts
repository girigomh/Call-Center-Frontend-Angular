import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Contact } from 'app/layout/common/quick-chat/quick-chat.types';
import { ContactService } from 'app/modules/admin/dashboards/contacts/contacts.service';
@Component({
  selector: 'contacts',
  templateUrl: './contacts.component.html',
})
export class ContactsComponent implements OnInit, OnDestroy {
  contact: Contact;
  id: any;
  url: any;
  name: any;
  private sub: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * On init
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.url = this.router.url;
      this.id = this.route.snapshot.params.id;
      this.name = this.route.snapshot.params.name;
      console.log('this.id=' + this.id);
    });

    // Contact
    this._contactService
      .getContactById(this.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((contact: Contact) => {
        this.contact = contact;
        console.log('this.contact=' + this.contact);
        if (contact.details !== undefined) {
          console.log('this.contact=' + this.contact.details);
          if (
            contact.details.emails !== undefined &&
            contact.details.emails.length > 0
          ) {
            console.log('this.contact=' + this.contact.details.emails[0].email);
          }
        }
      });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
