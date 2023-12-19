/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import { UserService } from "../../../../../core/user/user.service";
import { I18nModule } from "../../../../../core/i18n/i18n.module";
import { featchUserRole } from "../../../../../mock-api/common/navigation/check";
import { ContactListComponent } from "../contact-list/contact-list.component";

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from "@angular/core";
import * as countrycitystatejson from "countrycitystatejson";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { TemplatePortal } from "@angular/cdk/portal";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { debounceTime, Observable, Subject, takeUntil } from "rxjs";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { Country } from "../contacts.types";
import { User } from "app/shared/dtos/user";
import { ContactService } from "../contacts.service";
import { Location } from "@angular/common";
import { id } from "date-fns/locale";
import { CustomDatePipe } from "../custom-date.pipe";
import { PageEvent } from "@angular/material/paginator";
// import { OnlineStatus } from "app/core/user/user.types";
// import { MatDialog } from "@angular/material/dialog";
import { UserComponent } from "app/layout/common/user/user.component";
import { OnlineStatus } from "app/core/user/user.types";
import country from "../../../../utils/country-stateData.json";
import { Placeholders } from "app/core/placeholder.types";
import { CompanyService } from "../../company/company.service";
import { ApiResponse } from "app/shared/global/globals";
// let $: any;

@Component({
  selector: "app-contact-description",
  templateUrl: "./contact-description.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [CustomDatePipe],
})
export class ContactDescriptionComponent implements OnInit, OnDestroy {
  [x: string]: any;
  loading = true;
  userType: string | null = null;
  openDrawer() {
    throw new Error("Method not implemented.");
  }
  @ViewChild("avatarFileInput") private _avatarFileInput: ElementRef;
  @ViewChild("detailsPanel") private _detailsPanel: TemplateRef<any>;
  @ViewChild("detailsPanelOrigin") private _detailsPanelOrigin: ElementRef;
  currentUser: User;
  pageSize: number = 5;
  paginationEvent: any = {
    previousPageIndex: -1,
    pageIndex: 0,
    pageSize: 5,
    length: 20,
  };
  editMode: boolean = false;
  tagsEditMode: boolean = false;
  contact: any;
  contactChild: any;
  onlineStatus: OnlineStatus;
  contactForm: UntypedFormGroup;
  isAdmin: boolean = ["ADMIN"].includes(featchUserRole());
  contacts: User[];
  // countries: Country[];
  userOnlineStatus: string = "";
  allCountries = countrycitystatejson;
  countryValue: any;
  countries = this.allCountries.getCountries();
  states: any[];
  updatedStatusVariable: any;
  types: any;
  maxDate: Date;
  placeholder: Placeholders;

  contact$: Observable<User>;
  // contact: any;
  private _detailsPanelOverlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  updatedContact: User;

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _contactsListComponent: ContactListComponent,
    private _contactsService: ContactService,
    private _companyService: CompanyService,
    private _formBuilder: UntypedFormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private _renderer2: Renderer2,
    private _router: Router,
    private router: ActivatedRoute,
    private _overlay: Overlay,
    private route: ActivatedRoute,

    // private dialog: MatDialog,
    private _viewContainerRef: ViewContainerRef,
    private location: Location,
    private elementRef: ElementRef,
    // private cdr: ChangeDetectorRef,
    // private _contactService: ContactService,
    private _userService: UserService // private contactService: ContactService
  ) {
    this.maxDate = new Date();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.log(data,'::data::')
      this.userType = data.userType;
      this.loading = false; // Set loading to false once data is retrieved
    });
    // Subscribe to the onlineStatus$ observable to receive updates
    // this._userService.onlineStatus$.subscribe((isOnline: boolean) => {
    // Update the online status for each contact
    // this.contacts.forEach((contact: any) => {
    //   contact.isOnline = isOnline;
    // });

    // Mark for check
    // this._changeDetectorRef.markForCheck();
    // });
    this.placeholder = new Placeholders();

    // this.route.
    this.route.queryParams.subscribe((queryParams) => {
      console.log(queryParams)
      this.route.paramMap.subscribe((params) => {
        const contactId = params.get("userId");
        // const userType = queryParams.get(queryParams.keys[0])
        // const contactId = "136";
        // return
        if(queryParams.userType.toLowerCase() === "company" || queryParams.userType.toLowerCase() === "firma"){
          this._companyService.getCompanyById(contactId).subscribe((compnay:any) => {
            this.contact = compnay.data
            console.log(this.contact)
            // let data: any = this.contact.profile.name;
            // switch (data) {
            //   case "SWITCHINGCALLCENTER":
            //     this.contactChild = [
            //       "SWITCHINGCALLCENTEREMPLOYEE",
            //       "SWITCHINGCALLCENTERLEADER",
            //     ];
            //     break;
    
            //   case "COMPANY":
            //     this.contactChild = ["COMPANYEMPLOYEE", "COMPANYLEADER"];
            //     break;
            //   default:
            //     this.contactChild = [""];
            //     break;
            // }
    
          })
        } else {
          this._contactsService.getContactById(contactId).subscribe((contact) => {
            this.contact = contact;
            console.log("yes i am contact", this.contact, this.contacts);
            this.contacts = this.contacts;
          
            console.log("contact", this.contactChild);
    
            // this.testDate = new Date(this.contact.birthday); // Assuming `birthday` is a property of the `contact` object containing the birthday value
            this._changeDetectorRef.detectChanges();
          });
    
          this.contact$ = this._contactsService.getContactById(contactId);
        }
        // this.getContactDetails(contactId);
      });
    })
    this._userService.getUserTypes().subscribe((types: any[]) => {
      // Load the contacts
      // eslint-disable-next-line @typescript-eslint/semi, max-len
      this.types = types.filter(
        (type: any) =>
          type.name === "TRANSLATOR" ||
          type.name === "CAPTIONER" ||
          type.name === "COMMUNICATIONASSISTENCE" ||
          type.name === "COMPANY"
      );
      this.types.forEach((type) => {
        type.label = I18nModule.translate(type.name);
      });
    });

    // Open the drawer
    this._contactsListComponent.matDrawer.open();

    // Create the contact form
    // this.contactForm = this._formBuilder.group({
    //   id: [''],
    //   avatar: [null],
    //   name: ['', [Validators.required]],
    //   emails: this._formBuilder.array([]),
    //   phoneNumbers: this._formBuilder.array([]),
    //   title: [''],
    //   company: [''],
    //   birthday: [null],
    //   address: [null],
    //   notes: [null],
    //   tags: [[]],
    // });

    this.contactForm = this._formBuilder.group({
      email: ["", [Validators.email]],
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      zip: [""],
      phoneNo: [""],
      houseNo: [""],
      state: ["", [Validators.required]],
      country: ["", [Validators.required]],
      location: ["", [Validators.required]],
      street: ["", [Validators.required]],
      userType: ["", [Validators.required]],
      companyName: [""],
      birthday: [""],
    });

    // Get the contacts
    this._contactsService.contacts$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((contacts: User[]) => {
        this.contacts = contacts;
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Get the contact
    this._contactsService.contact$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((contact: User) => {
        // Open the drawer in case it is closed
        this._contactsListComponent.matDrawer.open();
        // Get the contact
        // this.contact = contact;

        // Clear the emails and phoneNumbers form arrays
        (this.contactForm.get("emails") as UntypedFormArray).clear();
        (this.contactForm.get("phoneNumbers") as UntypedFormArray).clear();

        // Patch values to the form
        this.contactForm.patchValue(contact);

        // Setup the emails form array
        // const emailFormGroups = [];

        // if (contact?.emails?.length > 0) {
        //   // Iterate through them
        //   contact.emails.forEach((email) => {
        //     // Create an email form group
        //     emailFormGroups.push(
        //       this._formBuilder.group({
        //         email: [email.email],
        //         label: [email.label],
        //       })
        //     );
        //   });
        // } else {
        //   // Create an email form group
        //   emailFormGroups.push(
        //     this._formBuilder.group({
        //       email: [""],
        //       label: [""],
        //     })
        //   );
        // }

        // // Add the email form groups to the emails form array
        // emailFormGroups.forEach((emailFormGroup) => {
        //   (this.contactForm.get("emails") as UntypedFormArray).push(
        //     emailFormGroup
        //   );
        // });

        // Setup the phone numbers form array
        const phoneNumbersFormGroups = [];

        // if (contact?.phoneNumbers?.length > 0) {
        //   // Iterate through them
        //   contact.phoneNumbers.forEach((phoneNumber) => {
        //     // Create an email form group
        //     phoneNumbersFormGroups.push(
        //       this._formBuilder.group({
        //         country: [phoneNumber.country],
        //         phoneNumber: [phoneNumber.phoneNumber],
        //         label: [phoneNumber.label],
        //       })
        //     );
        //   });
        // } else {
        //   // Create a phone number form group
        //   phoneNumbersFormGroups.push(
        //     this._formBuilder.group({
        //       country: ["us"],
        //       phoneNumber: [""],
        //       label: [""],
        //     })
        //   );
        // }

        // Add the phone numbers form groups to the phone numbers form array
        phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
          (this.contactForm.get("phoneNumbers") as UntypedFormArray).push(
            phoneNumbersFormGroup
          );
        });

        // Toggle the edit mode off
        this.toggleEditMode(false);

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Get the country telephone codes
    this._contactsService.countries$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((codes: Country[]) => {
        this.countries = codes;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    this.countryValue = country.Countries;
  }

  handlePageChange(e: PageEvent): any {
    this.paginationEvent = e;
  }

  // Event handler for updating user status
  // onUpdateUserStatus(updatedStatus: string): void {
  //   // Display the updated status or perform any other logic here
  // Assign the updated status to a variable to display in the template
  //   this.updatedStatusVariable = updatedStatus;
  // }

  onUserStatusUpdate(onlineStatus: OnlineStatus): void {
    this.onlineStatus = onlineStatus;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    // Dispose the overlays if they are still on the DOM
    if (this._detailsPanelOverlayRef) {
      this._detailsPanelOverlayRef.dispose();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Close the drawer
   */
  // closeDrawer(): Promise<MatDrawerToggleResult> {
  //   this._contactsListComponent.selectedContact = null;
  //   this.location.replaceState("/dashboard/contacts");
  //   return this._contactsListComponent.matDrawer.toggle();
  // }

  closeDrawer(): Promise<MatDrawerToggleResult> {
    this._contactsListComponent.selectedContact = null;
    this.location.replaceState("/dashboard/contacts");

    return new Promise<MatDrawerToggleResult>((resolve) => {
      this._contactsListComponent.matDrawer.toggle().then(() => {
        // Open the drawer immediately after closing
        this._contactsListComponent.matDrawer.open();
        console.log(typeof this._contactsListComponent.selectedContact);
        if (this._contactsListComponent.selectedContact != null) {
        }
        resolve(undefined);
      });
    });
  }

  /**
   * Toggle edit mode
   *
   * @param editMode
   */

  toggleEditMode(editMode: boolean | null = null): void {
    this.isEditMode = !this.isEditMode;
    this.isEditModeClicked = true;
    if (editMode === null) {
      this.editMode = !this.editMode;
    } else {
      this.editMode = editMode;
    }
    let new_date = `${this.contact.birthday[1]}/${this.contact.birthday[2]}/${this.contact.birthday[0]}`;
    this.contactForm.patchValue({
      ...this.contact,
      birthday: new Date(new_date),
    });
    // this.contactForm.patchValue({ birthday: '11/12/2006' });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  getCountryName(name: any) {
    const stateNames = this.countryValue.filter((i: any) => {
      if (i.CountryName === name) {
        return i.States;
      }
    });
    this.states = stateNames[0].States;
  }

  /**
   * Update the contact
   */
  updateContact(): void {
    // Get the contact object
    const contact = this.contactForm.getRawValue();

    // Go through the contact object and clear empty values
    contact.emails = contact.emails.filter((email) => email.email);
    //  contact.username = contact.emails.filter((username) => username.username);
    contact.phoneNumbers = contact.phoneNumbers.filter(
      (phoneNumber) => phoneNumber.phoneNumber
    );

    // Update the contact on the server
    this._contactsService.updateContact(contact.id, contact).subscribe(() => {
      // Toggle the edit mode off
      this.toggleEditMode(false);
    });
  }

  minimumAgeValidator(control: FormControl): { [key: string]: any } | null {
    if (control.value) {
      const today = new Date();
      const selectedDate = new Date(control.value);
      const minimumAgeDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );

      if (selectedDate > minimumAgeDate) {
        return { minimumAge: true };
      }
    }

    return null;
  }

  /**
   * Delete the contact
   */
  deleteContact(): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete contact",
      message:
        "Are you sure you want to delete this contact? This action cannot be undone!",
      actions: {
        confirm: {
          label: "Delete",
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === "confirmed") {
        // Get the current contact's id
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const id = this.contact.userId;

        // Get the next/previous contact's id
        const currentContactIndex = this.contacts.findIndex(
          (item) => item.userId === id
        );
        const nextContactIndex =
          currentContactIndex +
          (currentContactIndex === this.contacts.length - 1 ? -1 : 1);
        const nextContactId =
          this.contacts.length === 1 && this.contacts[0].userId === id
            ? null
            : this.contacts[nextContactIndex].userId;

        // Delete the contact
        this._contactsService.deleteContact(id).subscribe((isDeleted) => {
          // Return if the contact wasn't deleted...
          if (!isDeleted) {
            return;
          }

          // Navigate to the next contact if available
          if (nextContactId) {
            this._router.navigate(["../", nextContactId], {
              relativeTo: this._activatedRoute,
            });
          }
          // Otherwise, navigate to the parent
          else {
            this._router.navigate(["../"], {
              relativeTo: this._activatedRoute,
            });
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);
        });

        // Mark for check
        this._changeDetectorRef.markForCheck();
      }
    });
  }

  /**
   * Upload avatar
   *
   * @param fileList
   */
  uploadAvatar(fileList: FileList): void {
    // Return if canceled
    if (!fileList.length) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    const file = fileList[0];

    // Return if the file is not allowed
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    // Upload the avatar
    this._contactsService.uploadAvatar(this.contact?.userId, file).subscribe();
  }

  /**
   * Remove the avatar
   */
  removeAvatar(): void {
    // Get the form control for 'avatar'
    const avatarFormControl = this.contactForm.get("avatar");

    // Set the avatar as null
    avatarFormControl.setValue(null);

    // Set the file input value as null
    this._avatarFileInput.nativeElement.value = null;

    // Update the contact
    this.contact.profilePhoto = null;
  }

  /**
   * Open tags panel
   */
  opendetailsPanel(): void {
    // Create the overlay
    this._detailsPanelOverlayRef = this._overlay.create({
      backdropClass: "",
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this._detailsPanelOrigin.nativeElement)
        .withFlexibleDimensions(true)
        .withViewportMargin(64)
        .withLockedPosition(true)
        .withPositions([
          {
            originX: "start",
            originY: "bottom",
            overlayX: "start",
            overlayY: "top",
          },
        ]),
    });

    // Subscribe to the attachments observable
    this._detailsPanelOverlayRef.attachments().subscribe(() => {
      // Add a class to the origin
      this._renderer2.addClass(
        this._detailsPanelOrigin.nativeElement,
        "panel-opened"
      );

      // Focus to the search input once the overlay has been attached
      this._detailsPanelOverlayRef.overlayElement
        .querySelector("input")
        .focus();
    });

    // Create a portal from the template
    const templatePortal = new TemplatePortal(
      this._detailsPanel,
      this._viewContainerRef
    );

    // Attach the portal to the overlay
    this._detailsPanelOverlayRef.attach(templatePortal);

    // Subscribe to the backdrop click
    this._detailsPanelOverlayRef.backdropClick().subscribe(() => {
      // Remove the class from the origin
      this._renderer2.removeClass(
        this._detailsPanelOrigin.nativeElement,
        "panel-opened"
      );

      // If overlay exists and attached...
      if (
        this._detailsPanelOverlayRef &&
        this._detailsPanelOverlayRef.hasAttached()
      ) {
        // Detach it
        this._detailsPanelOverlayRef.detach();

        // Reset the tag filter

        // Toggle the edit mode off
        this.tagsEditMode = false;
      }

      // If template portal exists and attached...
      if (templatePortal && templatePortal.isAttached) {
        // Detach it
        templatePortal.detach();
      }
    });
  }

  /**
   * Should the create tag button be visible
   *
   * @param inputValue
   */
  shouldShowCreateTagButton(inputValue: string): boolean {
    return false;
  }

  /**
   * Add the email field
   */
  addEmailField(): void {
    // Create an empty email form group
    const emailFormGroup = this._formBuilder.group({
      email: [""],
      label: [""],
    });

    // Add the email form group to the emails form array
    (this.contactForm.get("emails") as UntypedFormArray).push(emailFormGroup);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Remove the email field
   *
   * @param index
   */
  removeEmailField(index: number): void {
    // Get form array for emails
    const emailsFormArray = this.contactForm.get("emails") as UntypedFormArray;

    // Remove the email field
    emailsFormArray.removeAt(index);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Add an empty phone number field
   */
  addPhoneNumberField(): void {
    // Create an empty phone number form group
    const phoneNumberFormGroup = this._formBuilder.group({
      country: ["us"],
      phoneNumber: [""],
      label: [""],
    });

    // Add the phone number form group to the phoneNumbers form array
    (this.contactForm.get("phoneNumbers") as UntypedFormArray).push(
      phoneNumberFormGroup
    );

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Remove the phone number field
   *
   * @param index
   */
  removePhoneNumberField(index: number): void {
    // Get form array for phone numbers
    const phoneNumbersFormArray = this.contactForm.get(
      "phoneNumbers"
    ) as UntypedFormArray;

    // Remove the phone number field
    phoneNumbersFormArray.removeAt(index);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }
  getUserType(name: any): any {
    return this.types.find((i: any) => i.name === name);
  }
  /**
   * Get country info by iso code
   *
   * @param iso
   */
  getCountryByIso(iso: string): Country {
    return this.countries.find((country) => country.iso === iso);
  }
  goBack(): any {
    this._router.navigate([{ outlets: { detail: null } }], {
      relativeTo: this._activatedRoute.parent,
    });
  }
  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.userId || index;
  }


  formatDate(arr: any): any {
    const dateString = new Date(`${arr[0]}/${arr[1]}/${arr[2]}`);
    return dateString.toLocaleDateString().split('/').join('.');
  }
}
