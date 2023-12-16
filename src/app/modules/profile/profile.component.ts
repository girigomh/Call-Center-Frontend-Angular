/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/member-ordering */
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseConfirmationService } from "./../../../@fuse/services/confirmation/confirmation.service";
import { takeUntil, Subject, debounceTime } from "rxjs";
import { ContactService } from "../admin/dashboards/contacts/contacts.service";
import { Country } from "app/modules/admin/dashboards/contacts/contacts.types";
import { AuthService } from "./../../core/auth/auth.service";
// import country from '../../../../utils/country-stateData.json';
import country from "../utils/country-stateData.json";
import { Placeholders } from "app/core/placeholder.types";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  Renderer2,
  ViewContainerRef,
  TemplateRef,
  ElementRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { UserService } from "app/core/user/user.service";
import { User } from "app/shared/dtos/user";
import { TemplatePortal } from "@angular/cdk/portal";
import {
  UntypedFormArray,
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
} from "@angular/forms";
// import { CustomDatePipe } from "../admin/dashboards/contacts/custom-date.pipe";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
// import { minimumAgeValidator } from "./age-validator";
import { DateAdapter } from "@angular/material/core";
import { ProfileDataService } from "app/shared/profile-photo.service";
import { window } from "rxjs/operators";
import { TeamMemberService } from "app/shared/team-member-service.service";
import { I18nModule } from "app/core/i18n/i18n.module";
import { TranslateService } from "@ngx-translate/core";
// import { minimumAgeValidator } from "./minimum-age.validator";

@Component({
  selector: "profile",
  templateUrl: "./profile.component.html",
  encapsulation: ViewEncapsulation?.None,
  changeDetection: ChangeDetectionStrategy?.OnPush,
  // providers: [CustomDatePipe],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild("avatarFileInput") private _avatarFileInput: ElementRef;
  currentUser: User;
  userData: any = JSON.parse(localStorage.getItem("currentUser"));
  userProfileData: any;
  editMode: boolean = false;
  isEditMode: boolean = false;
  tagsEditMode: boolean = false;
  contact: User;
  //   contactForm: UntypedFormGroup;
  contactForm: FormGroup;
  maxDate: Date;
  contacts: User[];
  countries: Country[];
  private _tagsPanelOverlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  countryValue: any;
  placeholder: any;
  states: any;

  accountData: any = {
    userId: "cfa07b7c-93d1-42e7-9592-493d9efc78ae",
    avatar: "assets/images/avatars/male-02.jpg",
    background:
      "https://images.unsplash.com/photo-1693711836001-99859bb7185a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1557&q=80",
    name: "Video Call Center",
  };

  // localizedStrings = {
  //   "userProfile.about": "Über mich",
  //   "userProfile.country": "Land",
  //   "userProfile.title": "Titel",
  //   "userProfile.language": "Sprache",
  //   "userProfile.viewBio": "Meine Biografie anzeigen",
  // };

  // localizedStrings = {
  //   "userProfileData.about": this.translate.instant("userProfileData.about"),
  //   "userProfile.country": this.translate.instant("userProfile.country"),
  //   "userProfile.title": this.translate.instant("userProfile.title"),
  //   "userProfile.language": this.translate.instant("userProfile.language"),
  //   "userProfile.viewBio": this.translate.instant("userProfile.viewBio"),
  // };

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _contactsService: ContactService,
    private _formBuilder: UntypedFormBuilder,
    private formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private _renderer2: Renderer2,
    private _router: Router,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _authService: AuthService,
    private dateAdapter: DateAdapter<Date>,
    private profileDataService: ProfileDataService,
    private TeamMemberService: TeamMemberService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang("en");
    translate.use("de");
    this.contactForm = this.formBuilder.group({
      userId: [""],
      profilePhoto: [""],
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      address: ["22, brickfield road Lagos", [Validators.required]],
      profile: ["", [Validators.required]],
      username: ["", [Validators.required]],
      phoneNumber: ["+5793863837", [Validators.required]],
      title: ["", [Validators.required]],
      zip: ["", [Validators.required]],
      location: ["", [Validators.required]],
      gender: ["", Validators.required],
      street: ["", [Validators.required]],
      houseNo: ["", [Validators.required]],
      company: ["Company data"],
      country: ["", [Validators.required]],
      state: ["", [Validators.required]],
      dob: ["", [Validators.required, this.minimumAgeValidator]],
      // birthday: [null],
      notes: ["This note section can actually be left empty1"],
      emails: this.formBuilder.array([
        this.formBuilder.group({
          email: [""],
          label: [""],
        }),
      ]),
      phoneNumbers: this.formBuilder.array([
        this.formBuilder.group({
          country: ["us"],
          phoneNumber: ["", [Validators.required]],
          label: [""],
        }),
      ]),
    });
    // const userData = this.profileDataService.getUserData();
    // console.log(this.userData);
    // this.contactForm.patchValue(userData);
    this.dateAdapter.setLocale("en");
    // Calculate the maximum date as today minus 18 years
    const today = new Date();
    this.maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    this.placeholder = new Placeholders();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  control = new FormControl();

  ngOnInit(): void {
    // this.userData = this.profileDataService.getUserData();
    this.profileDataService.getUserData().subscribe(
      (data) => {
        // Data has been retrieved successfully, process it here
        console.log("User Data:", data);

        // You can map through the data and display specific parts if needed
        if (data.someArray) {
          data.someArray.forEach((item) => {
            item.label = I18nModule.translate(item.name);
            console.log("Item:", item);
          });
        }
      },
      (error) => {
        console.error("Error:", error);
      }
    );

    this.userProfileData = this.TeamMemberService.getData();
    // Fetch the currently logged-in user data from AuthService
    this.userData = this._authService.getCurrentUser();
    // If currentUser is available, populate userType and email fields
    if (this.userData) {
      this.contactForm.patchValue({
        userType: this.userData.profile.name,
        username: this.userData.username,
      });

      // Disable userType and email fields initially if not in edit mode
      if (!this.editMode) {
        this.contactForm.get("profile").disable();
        this.contactForm.get("username").disable();
        // const usernameFormArray = this.contactForm.get("username") as FormArray;
        // usernameFormArray.controls.forEach((control) =>
        //   control.get("username").disable()
        // );
      }
    }
    // Get the contacts
    this._contactsService?.contacts$
      ?.pipe(takeUntil(this._unsubscribeAll))
      ?.subscribe((contacts: User[]) => {
        this.contacts = contacts;
        console.log(this.userData);

        // Mark for check
        this._changeDetectorRef?.markForCheck();
      });

    // Get the contact
    this._contactsService?.contact$
      ?.pipe(takeUntil(this._unsubscribeAll))
      ?.subscribe((contact: User) => {
        // Open the drawer in case it is closed

        // Get the contact
        this.contact = this.userData;
        this.contactForm.patchValue(contact);
        // Clear the emails and phoneNumbers form arrays
        (this.contactForm?.get("emails") as UntypedFormArray)?.clear();
        (this.contactForm?.get("phoneNumbers") as UntypedFormArray)?.clear();

        // Patch values to the form
        this.contactForm?.patchValue(this.userData);

        // Toggle the edit mode off
        this.toggleEditMode(false);

        // Mark for check
        this._changeDetectorRef?.markForCheck();
      });

    // Get the country telephone codes
    this._contactsService.getCountries().subscribe((data: any) => {
      this.countries = data;
    });
    this.contactForm.patchValue({
      ...this.userData,
      // birthday: new Date(newDate),
      birthday: new Date(),
    });

    this.countryValue = country.Countries;
    this.contactForm.get('profile').setValue(this.userData.profile.name)
    this.contactForm.get('gender').setValue(this.userData.gender.toLowerCase() === "male" ? "M" : this.userData.gender.toLowerCase() === "female" ? "F" : "O")
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll?.next(null);
    this._unsubscribeAll?.complete();

    // Dispose the overlays if they are still on the DOM
    if (this._tagsPanelOverlayRef) {
      this._tagsPanelOverlayRef?.dispose();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * Toggle edit mode
   *
   * @param editMode
   */

  toggleEditMode(editMode: boolean | null = null): void { 
    if (editMode === null) {
      this.editMode = !this.editMode;
    } else {
      this.editMode = editMode;
    }


    // Enable userType and email fields in edit mode
    if (this.editMode) {
      // this.contactForm.get("userType").enable();

      // Check if the usernameFormArray exists and has controls before performing forEach
      const usernameFormArray = this.contactForm.get("username") as FormArray;
      if (usernameFormArray && usernameFormArray.controls) {
        usernameFormArray.controls.forEach((control: FormControl) =>
          control.get("username").enable()
        );
      }
    } else {
      // Disable userType and email fields when not in edit mode
      this.contactForm.get("profile").disable();
      this.contactForm.get("username").disable();

      // Check if the usernameFormArray exists and has controls before performing forEach
      // const usernameFormArray = this.contactForm.get("username") as FormArray;
      // if (usernameFormArray && usernameFormArray.controls) {
      //   usernameFormArray.controls.forEach((control) =>
      //     control.get("username").disable()
      //   );
      // }
    }

    this._changeDetectorRef?.markForCheck();
  }

  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (): void => {
        // Read the uploaded file as a base64-encoded string
        const base64String = reader.result as string;

        // Get the existing userData from local storage or create an empty object
        const userData = JSON.parse(localStorage.getItem("userData")) || {};

        // Update the 'profilePhoto' property with the base64 image data
        userData.profilePhoto = base64String;

        // Store the updated userData in local storage
        localStorage.setItem("userData", JSON.stringify(userData));

        console.log("Uploaded file:", file);
        console.log("Base64 encoded string:", base64String);

        // Now, userData in local storage contains the profile photo
      };
      reader.readAsDataURL(file);
    }
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
    const isAddressChanged:boolean = !this.contactForm.get('houseNo').pristine || !this.contactForm.get('zip').pristine || !this.contactForm.get('location').pristine || !this.contactForm.get('street').pristine || !this.contactForm.get('state').pristine || !this.contactForm.get('country').pristine
    const isUserDetailsChnaged: boolean = !this.contactForm.get('firstName').pristine || !this.contactForm.get('lastName').pristine || !this.contactForm.get('gender').pristine || !this.contactForm.get('dob').pristine || !this.contactForm.get('state').pristine || !this.contactForm.get('phoneNumber').pristine
    if(isAddressChanged){
      let addressPayload = {
        houseNo: this.contactForm.value.houseNo.toString(),
        street: this.contactForm.value.street,
        location: this.contactForm.value.location,
        city: this.contactForm.value.city,
        state: this.contactForm.value.state,
        country: this.contactForm.value.country,
        zip: this.contactForm.value.zip 
      }
      this._userService.editUserAddress(addressPayload).subscribe((response) => {
        console.log(response)
      })
    }
    return


    // Go through the contact object and clear empty values
    // if (Array.isArray(contact?.emails)) {
    //   contact.emails = contact.emails.filter((email) => email?.email);
    // }

    // if (Array.isArray(contact?.phoneNumbers)) {
    //   contact.phoneNumbers = contact.phoneNumbers.filter(
    //     (phoneNumber) => phoneNumber?.phoneNumber
    //   );
    // }

    this.userData = contact;

    // Disable userType and email fields after updating
    this.contactForm.get("profile").disable();
    this.contactForm.get("username").disable();
    this.contactForm.get("firstName").disable();
    this.contactForm.get("lastName").disable();
    // usernameFormArray.controls.forEach((control) =>
    //   control.get("username").disable()
    // );

    // Toggle edit mode off after updating
    this.toggleEditMode(false);
    localStorage.setItem("userData", JSON.stringify(this.userData));

    // Mark for check
    this._changeDetectorRef?.markForCheck();
    console.log(this.userData);
  }

  // Custom validator function
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
    const confirmation = this._fuseConfirmationService?.open({
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
    confirmation?.afterClosed()?.subscribe((result) => {
      // If the confirm button pressed?.?.?.
      if (result === "confirmed") {
        // Get the current contact's id
        const id = this.userData?.userId;

        // Get the next/previous contact's id
        const currentContactIndex = this.contacts?.findIndex(
          (item: any) => item?.userId === id
        );
        const nextContactIndex =
          currentContactIndex +
          (currentContactIndex === this.contacts?.length - 1 ? -1 : 1);
        const nextContactId =
          this.contacts?.length === 1 && this.contacts[0]?.userId === id
            ? null
            : this.contacts[nextContactIndex]?.userId;

        // Delete the contact
        this._contactsService?.deleteContact(id)?.subscribe((isDeleted) => {
          // Return if the contact wasn't deleted?.?.?.
          if (!isDeleted) {
            return;
          }

          // Navigate to the next contact if available
          if (nextContactId) {
            this._router?.navigate(["?.?./", nextContactId], {
              relativeTo: this._activatedRoute,
            });
          }
          // Otherwise, navigate to the parent
          else {
            this._router?.navigate(["?.?./"], {
              relativeTo: this._activatedRoute,
            });
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);
        });

        // Mark for check
        this._changeDetectorRef?.markForCheck();
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
    if (!fileList?.length) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    const file = fileList[0];

    // Return if the file is not allowed
    if (!allowedTypes?.includes(file?.type)) {
      return;
    }

    // Upload the avatar
    this._contactsService
      ?.uploadAvatar(this.userData?.userId, file)
      ?.subscribe();
  }

  /**
   * Remove the avatar
   */
  removeAvatar(): void {
    // Get the form control for 'avatar'
    const avatarFormControl = this.contactForm?.get("avatar");

    // Set the avatar as null
    avatarFormControl?.setValue(null);

    // Set the file input value as null
    this._avatarFileInput.nativeElement.value = null;

    // Update the contact
    this.userData.avatar = null;
  }

  /**
   * Add the email field
   */

  // addEmailField(): void {
  //   const emailFormArray = this.contactForm.get("emails") as FormArray;
  //   const newEmailControl = this._formBuilder.control("", [
  //     Validators.required,
  //   ]);
  //   emailFormArray.push(newEmailControl);
  //   this._changeDetectorRef.markForCheck();
  // }

  addPhoneNumberField(): void {
    const phoneNumbersFormArray = this.contactForm.get(
      "phoneNumbers"
    ) as FormArray;
    const newPhoneNumberControl = this._formBuilder.control("", [
      Validators.required,
    ]);
    phoneNumbersFormArray.push(newPhoneNumberControl);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Remove the email field
   *
   * @param index
   */
  // removeEmailField(index: number): void {
  // Get form array for emails
  // const emailsFormArray = this.contactForm?.get("emails") as UntypedFormArray;

  // Remove the email field
  // emailsFormArray?.removeAt(index);

  // Mark for check
  // this._changeDetectorRef?.markForCheck();
  // }

  /**
   * Remove the phone number field
   *
   * @param index
   */
  removePhoneNumberField(index: number): void {
    // Get form array for phone numbers
    const phoneNumbersFormArray = this.contactForm?.get(
      "phoneNumbers"
    ) as UntypedFormArray;

    // Remove the phone number field
    phoneNumbersFormArray?.removeAt(index);

    // Mark for check
    this._changeDetectorRef?.markForCheck();
  }

  /**
   * Get country info by iso code
   *
   * @param iso
   */
  getCountryByIso(iso: string): Country {
    return this.countries?.find((country: any) => country?.iso === iso);
  }
  goBack(): any {
    this._router?.navigate([{ outlets: { detail: null } }], {
      relativeTo: this._activatedRoute?.parent,
    });
  }
  formatDate(arr: any): any {
    const dateString = new Date(`${arr[0]}/${arr[1]}/${arr[2]}`);
    return dateString.toLocaleDateString().split('/').join('.');
  }
  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item?.userId || index;
  }
}
