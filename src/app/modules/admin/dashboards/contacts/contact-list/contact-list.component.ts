import { MatDialog } from '@angular/material/dialog';
import { featchUserRole } from '../../../../../mock-api/common/navigation/check';
import { FuseMediaWatcherService } from '../../../../../../@fuse/services/media-watcher/media-watcher.service';
import { Country } from '../contacts.types';
// import { I18nModule } from 'app/core/i18n/i18n.module';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  LOCALE_ID,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { User } from 'app/shared/dtos/user';
import {
  Observable,
  Subject,
  filter,
  takeUntil,
  switchMap,
  tap,
  fromEvent,
  map,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ContactService } from '../contacts.service';
import { DOCUMENT } from '@angular/common';
import { AddContactFormComponent } from '../add-contact-form/add-contact-form.component';
import { I18nModule } from 'app/core/i18n/i18n.module';
import { CHECKBOX_CONFIG, CheckboxConfig } from './checkbox-config';
import { contacts } from 'app/mock-api/apps/chat/data';
import * as data from '../contects.types';
import { CompanyService } from '../../company/company.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ContactListComponent implements OnInit, OnDestroy {
  [x: string]: any;
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

  contacts$: Observable<User[]>;

  contactsCount: number = 0;
  change: boolean = true;
  search: any = '';
  role: string;
  firstName: string;
  lastName: string;
  searchPlaceholder: string = '';
  contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
  countries: Country[];
  showAdd: boolean = [
    'COMPANYEMPLOYEE',
    'INTERPRETER',
    'CAPTIONER',
    'COMMUNICATIONASSISTENCE',
    'CUSTOMER',
    'COMPANY',
    'TRANSLATOR',
    'COMPANYLEADER',
  ].includes(featchUserRole());
  drawerMode: 'side' | 'over';
  dailogRef: any;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedContact: User;
  type: any;
  // users: any[];
  contacts: any[];
  show: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // Inside your component
  // numberValue = 16;
  // numberArray = [this.numberValue];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 16;
  paginatedContacts: any[];
  paramsType: any;

  getContactRange(): number[] {
    return Array.from({ length: this.totalContacts }, (_, index) => index);
  }
  /**
   * Constructor
   */
  constructor(
   @Inject(CHECKBOX_CONFIG) private checkboxConfig: CheckboxConfig,
    private companyService: CompanyService,
    private _activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private _changeDetectorRef: ChangeDetectorRef,
    private _contactsService: ContactService,
    @Inject(DOCUMENT) private _document: any,
    public dialog: MatDialog,
    private _router: Router,
    private router: Router,
    private _route: ActivatedRoute,
    private _fuseMediaWatcherService: FuseMediaWatcherService,

    @Inject(LOCALE_ID) public locale: string
  ) {
    // Calculate the total number of pages
    if (contacts && Array.isArray(contacts) && contacts.length) {
      this.totalPages = Math.ceil(contacts.length / this.itemsPerPage);
    } else {
      //console.log('Incorrect or empty contacts array!');
    }

    this.isInterpreter = this.checkboxConfig.isInterpreterChecked;
    this.isCaptionerChecked = this.checkboxConfig.isCaptionerChecked;
    this.isSwitchingcenterChecked = this.checkboxConfig.isSwitchingcenterChecked;
    this.isCompanyChecked = this.checkboxConfig.isCompanyChecked;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Search functionality from dashboard;
    this._activatedRoute.queryParams.subscribe((params) => {
      if (params.type) {
        // this.search = params.type;
        this.paramsType = params.type;
      }
    });

    this._contactsService.contacts$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((filteredContacts: any[]) => {
        this.companyService.getAllCompanies().subscribe((allCompanies) => {
          
        this.contacts = [...filteredContacts, ...allCompanies];
        this.contacts = this.contacts.map((e) => ({
          ...e,
          profile: {name: I18nModule.translate(e.profile.name)},
        }));
        if (this.paramsType) {
          this.contacts = this.contacts.filter(
            (e: any) => e.profile.name.split('_').join('').toUpperCase() === this.paramsType.toUpperCase()
          );
        } else {
          this.contacts = this.contacts;
        }
     
        if (this.paramsType == 'Interpreter') {
          this.isInterpreterChecked = true;
        }
        if (this.paramsType == 'Captioner') {
          this.isCaptionerChecked = true;
        }
        this.currentPage = 1;
        this.paginateContacts();

        this.contacts.sort((a: any, b: any) => {
          // if (!a.firstName || !b.firstName ) {
          //   return;
          // }
          const fa = a.firstName ? a.firstName.toLowerCase() : a.name.toLowerCase();
          const fb = b.firstName ? b.firstName.toLowerCase() : b.name.toLowerCase();
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
        this.contacts = this.contacts.filter((e: any) => e.firstName !== null);
        localStorage.setItem("contacts", JSON.stringify(this.contacts)) // comment when get company API is working
        this.changePage(1);
        //console.log(contacts);

        // Mark for check
        this._changeDetectorRef.markForCheck();
        })
      });

    this._contactsService.contacts$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((contacts: any[]) => {
        // Update the counts
        //  this.contactService.getAll().subscribe((contacts) => {
        //    this.contactsCount = contacts.length;
        //  });
        this.contactsCount = contacts.length;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Get the contact
    this._contactsService.contact$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((contact: User) => {
        // Update the selected contact
        this.selectedContact = contact;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Get the countries
    this._contactsService.countries$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((countries: Country[]) => {
        // Update the countries
        this.countries = countries;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Subscribe to search input field value changes
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        switchMap((query) =>
          // Search
          this._contactsService.searchContacts(query)
        )
      )
      .subscribe();

    // Subscribe to MatDrawer opened change
    this.matDrawer.openedChange.subscribe((opened) => {
      console.log('opeen');
      if (!opened) {
        // Remove the selected contact when drawer closed
        this.selectedContact = null;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      }
    });

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Set the drawerMode if the given breakpoint is active
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
        } else {
          this.drawerMode = 'over';
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Listen for shortcuts
    fromEvent(this._document, 'keydown')
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter<KeyboardEvent>(
          (event) =>
            (event.ctrlKey === true || event.metaKey) && // Ctrl or Cmd
            event.key === '/' // '/'
        )
      )
      .subscribe(() => {
        this.createContact();
      });
    // const role = featchUserRole();
    // eslint-disable-next-line max-len
    // this.show = ![
    //   "ANONYMOUS",
    //   "COMPANYLEADER",
    //   "COMPANYEMPLOYEE",
    //   "SWITCHINGCENTERLEADER",
    //   "SWITCHINGCENTEMPLOYEE",
    //   "CAPTIONER",
    //   "COMMUNICATIONASSISTENCE",
    //   "CUSTOMER",
    // ].includes(role);
  }

  filterUsers(
    contacts,
    userTypesToFilter // An array of userTypes to filter (e.g., ["INTERPRETER", "CAPTIONER", ...])
  ) {
    userTypesToFilter = userTypesToFilter.map((userType) =>
      I18nModule.translate(userType)
    );
    console.log('conact', contacts, 'userType', userTypesToFilter);
    const role = featchUserRole(); // Get the user role using featchUserRole

    let filteredUsers = [...contacts]; // Create a copy of the original users array

    if (userTypesToFilter.length) {
      // Filter based on userTypesToFilter, but also check against the user's role
      filteredUsers = filteredUsers.filter((contacts: any) =>
        userTypesToFilter.includes(contacts.profile.name)
      );
      console.log('hello buddy', filteredUsers);
    }

    if (this.search) {
      filteredUsers = filteredUsers.filter((contacts) =>
        contacts.name.toLowerCase().includes(this.search.toLowerCase())
      );
    }

    return filteredUsers;
  }

  performSearch(e: any) {
    const userTypesToFilter = [];
    if (this.isInterpreterChecked) {
      userTypesToFilter.push('interpreter');
    }
    if (this.isCaptionerChecked) {
      userTypesToFilter.push('captioner');
    }
    if (this.isCompanyChecked) {
      userTypesToFilter.push('company');
    }
    if (this.isSwitchingcenterChecked) {
      userTypesToFilter.push('switching_center_leader');
    }

    this.paginatedContacts = this.filterUsers(this.contacts, userTypesToFilter);
    // console.log(filteredUsers);
    e.preventDefault();
  }

  // Function to paginate the contacts array based on the current page
  paginateContacts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedContacts = this.contacts.slice(startIndex, endIndex);
  }

  // Function to change the current page
  changePage(page: number) {
    this.currentPage = page;
    this.paginateContacts();
  }

  checkContactFilters(contact: any): boolean {
    if (this.isInterpreterChecked && contact.userType !== 'INTERPRETER') {
      return false;
    }
    if (this.isCaptionerChecked && contact.userType !== 'CAPTIONER') {
      return false;
    }
    if (
      this.isSwitchingcenterChecked &&
      contact.userType !== 'SWITCHINGCENTER'
    ) {
      return false;
    }
    if (this.isCompanyChecked && contact.userType !== 'COMPANY') {
      return false;
    }
    return true;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On backdrop clicked
   */
  onBackdropClicked(): void {
    // Log the current activated route
    //console.log('onBackdropClicked()....');
    //console.log(
    //   'Current activated route:',
    //   this._activatedRoute.snapshot.url.join('/')
    // );

    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    // Log the target route
    //console.log('Target route:', this._router.url);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Create contact
   */
  //  createContact(): void {
  //    // Create the contact
  //    this._contactsService.createContact(newContact).subscribe((newContact) => {
  //      //console.log(newContact);
  //  })
  //  }
  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  openAddInterpeterDailoug(): void {
    const role = featchUserRole();
    if (['ADMIN', 'SWITCHINGCENTER'].includes(role)) {
      this.dailogRef = this.dialog.open(AddContactFormComponent);
      this.dailogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          console.log(result);
        }
      });
    }
  }

  changeView() {
    this.change = !this.change;
    if (this.change) {
      this.itemsPerPage = 10;
    } else {
      this.itemsPerPage = 12;
    }
    this.paginateContacts();
  }
}
