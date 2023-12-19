import { PageEvent } from "@angular/material/paginator";
/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { Country } from "../contacts/contacts.types";
import { OverlayRef, Overlay } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormArray,
  FormGroup,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { User } from "app/shared/dtos/user";
import { Subject, takeUntil, debounceTime } from "rxjs";
import { ContactService } from "../contacts/contacts.service";
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import country from "../../../utils/country-stateData.json";

import { featchUserRole } from "app/mock-api/common/navigation/check";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { I18nModule } from "app/core/i18n/i18n.module";
import { UserType } from "app/shared/dtos/user_type";
import { MatDialog } from "@angular/material/dialog";
import { DateAdapter } from "@angular/material/core";
import { Placeholders } from "app/core/placeholder.types";
import { CompanyService } from "./company.service";

@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"),
      ),
    ]),
  ],
})
export class CompanyComponent implements OnInit, OnDestroy {
  employees: any[] = [];
  // contacts: any[] = [];
  dataSource = ELEMENT_DATA;
  states
  columnsToDisplay = ["name", "weight", "symbol", "position"];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, "expand"];
  expandedElement: PeriodicElement | null;
  [x: string]: any;
  employeeForm: FormGroup;
  employeesData: any[] = [];

  @ViewChild("avatarFileInput") private _avatarFileInput: ElementRef;
  @ViewChild("tagsPanel") private _tagsPanel: TemplateRef<any>;
  @ViewChild("tagsPanelOrigin") private _tagsPanelOrigin: ElementRef;
  currentUser: User = JSON.parse(localStorage.getItem("currentUser"));
  pageSize: number = 5;
  countryValue
  // newEmployeeData: {
  //   companyname: string;
  //   companylocation: string;
  // } = {
  //   companyname: '',
  //   companylocation: '',
  // };

  companyData: any = {
    userId: "cfa07b7c-93d1-42e7-9592-493d9efc78ae",
    avatar: "assets/images/logo/logo.svg",
    background:
      "https://images.unsplash.com/photo-1589282741585-30ab896335cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    name: "Video Call Center",
  };

  paginationEvent: any = {
    previousPageIndex: -1,
    pageIndex: 0,
    pageSize: 5,
    length: 20,
  };
  editMode: boolean = false;
  editCompanyForm: FormGroup;
  contact: User;
  contactForm: UntypedFormGroup;
  contacts: User[];
  countries: Country[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  closeDrawer: any;
  companyId: any;
  submitted = false;
  placeholder
  /**
   * Constructor
   */
  // contactForm: FormGroup;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private contactsService: ContactService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _contactsService: ContactService,
    private _formBuilder: UntypedFormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private _router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private companyService: CompanyService,
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<any> 
    // private _contactsService: ContactService,
  ) {

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.editMode = false
    console.log(this.currentUser);
    this.placeholder = new Placeholders();
    this.dateAdapter.getFirstDayOfWeek = () => {return 1}
    // Retrieve the stored employee data from local storage
    const storedEmployeeData = localStorage.getItem("newEmployeeData");
    if (storedEmployeeData) {
      const newEmployee = JSON.parse(storedEmployeeData);
      this.employees.push(newEmployee);
    }
  
    this.loadContacts();
    console.log(this.companyData)
    this.editCompanyForm = this.formBuilder.group({
      name: ['',Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phoneNo: ['',[Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      street: ['', Validators.required],
      location: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      houseNo: ['', Validators.required],
      state: ['', [Validators.required]],
      // linkForVideoCall: ['', Validators.required],
      // url: ['', Validators.required],
    })
    console.log(this.editCompanyForm.get('phoneNo'),'::this.editCompanyForm.errors::')
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      const formData = JSON.parse(storedData);
      this.formData = formData;
    }
    // this.editCompanyForm = this._formBuilder.group({
    //   // id: [""],
    //   profilePhoto: [],
    //   companyname: ["", [Validators.required]],
    //   zip: ["", [Validators.required]],
    //   companylocation: ["", [Validators.required]],
    //   email: ["", [Validators.required, Validators.email]],
    //   videocalllink: ["", [Validators.required]],
    //   phoneNo: [
    //     "",
    //     [
    //       Validators.required,
    //       Validators.minLength(10),
    //       Validators.maxLength(13),
    //     ],
    //   ],
    //   list: [""],
    //   country: ["", [Validators.required]],
    //   profilephoto: [""],
    //   url: [""],
    //   topic: ["", [Validators.required]],
    //   notes: ["", [Validators.required]],
    //   time: ["", [Validators.required]],
    // });

    // Get the contacts
    this._contactsService?.contacts$
      ?.pipe(takeUntil(this._unsubscribeAll))
      ?.subscribe((contacts: User[]) => {
        if (contacts) {
          this.contacts = contacts;
        } else {
          this.contacts = [];
        }
        // this.contacts = contacts;
        console?.log(contacts);

        // Mark for check
        this._changeDetectorRef?.markForCheck();
      });

    // Get the contact
    this._contactsService?.contact$
      ?.pipe(takeUntil(this._unsubscribeAll))
      ?.subscribe((contact: User) => {
        this.contact = this.companyData;

        // Patch values to the form
        this.contactForm?.patchValue(this.companyData);
        this.toggleEditMode(false);
        this._changeDetectorRef?.markForCheck();
      });
    this._contactsService.getCountries().subscribe((data: any) => {
      this.countries = data;
    });
    this.route.params.subscribe((params) => {
      if(params && params.companyname){
        // let allContacts = JSON.parse(localStorage.getItem('contacts'))
        // allContacts.filter((contact) => {
        //     if(contact.userType == "COMPANY"){
        //       this.getContactData(contact.userId, contact.userType, params.companyname)
        //   }
        // })
        this.companyService.getAllCompanies().subscribe((test) => {
          this.companyService.getCompanyByName(params.companyname).subscribe((data) => {
            this.companyData = { ...this.companyData, ...data[0] }
            console.log(this.companyData,"amf dfjs")
            
          })
        })
        // this.getContactData()
      } else {
        this.getContactData(this.currentUser.userId,this.currentUser.userType)
      }
    })
    this.countryValue = country.Countries;
  }


  get f(): { [key: string]: AbstractControl } {
    return this.editCompanyForm.controls;
  }

  handlePageChange(e: PageEvent): any {
    console.log(JSON.stringify(e));
    this.paginationEvent = e;
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll?.next(null);
    this._unsubscribeAll?.complete();
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
    // Check if the user is an ADMIN or COMPANYLEADER
    if (!this.isUserAdmin() && !this.isUserCompanyLeader()) {
      return;
    }

    if (editMode === null) {
      this.editMode = !this.editMode;
    } else {
      this.editMode = editMode;
    }

    console.log("this", this.contactForm.get("phoneNo")["controls"]);

    // Mark for check
    this._changeDetectorRef?.markForCheck();
  }

  isUserAdmin(): boolean {
    const userRole = featchUserRole();
    return userRole === "ADMIN";
  }

  isUserCompanyLeader(): boolean {
    const userRole = featchUserRole();
    return userRole === "COMPANYLEADER";
  }

  // Upload avatar to the company page
  handleAvatarChange(files: FileList) {
    if (files.length > 0) {
      this.avatarFile = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.companyData.avatar = e.target.result;
      };
      reader.readAsDataURL(this.avatarFile);
    }
  }

  loadContacts(): void {
    this.contactsService.getContacts().subscribe((contacts: any[]) => {
      this.contacts = contacts;
      console.log(contacts);
    });
  }

  handleProfilePhotoChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files[0];
  }

  openCallDialog(template) {
    const dialogRef = this.dialog.open(template, {
      width: "640px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  /**
   * Update the contact
   */
  updateContact(): void {
    if (this.contactForm.valid) {
      // Get the contact object
      const contact = this.contactForm?.getRawValue();
      // Go through the contact object and clear empty values
      contact.emails = contact?.emails?.filter((email) => email?.email);

      contact.phoneNumbers = contact?.phoneNumbers?.filter(
        (phoneNumber) => phoneNumber?.phoneNumber,
      );
      this.companyData = contact;
      this.toggleEditMode(false);
    }
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

    confirmation?.afterClosed()?.subscribe((result) => {
      if (result === "confirmed") {
        const id = this.companyData?.id;

        // Get the next/previous contact's id
        const currentContactIndex = this.contacts?.findIndex(
          (item) => item?.userId === id,
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
    // if (!fileList?.length) {
    //   return;
    // }
    // const allowedTypes = ["image/jpeg", "image/png"];
    // const file = fileList[0];
    // // Return if the file is not allowed
    // if (!allowedTypes?.includes(file?.type)) {
    //   return;
    // }
    // // Upload the avatar
    // this._contactsService
    //   ?.uploadAvatar(this.companyData?.id, file)
    //   ?.subscribe();
  }

  /**
   * Remove the avatar
   */
  removeAvatar(): void {}

  /**
   * Add the email field
   */
  addEmailField(): void {
    this._changeDetectorRef?.markForCheck();
  }

  /**
   * Remove the email field
   *
   * @param index
   */
  removeEmailField(index: number): void {
    this._changeDetectorRef?.markForCheck();
  }
  /**
   * Add an empty phone number field
   */
  addPhoneNumberField(): void {
    this._changeDetectorRef?.markForCheck();
  }
  /**
   * Remove the phone number field
   *
   * @param index
   */
  removePhoneNumberField(index: number): void {
    this._changeDetectorRef?.markForCheck();
  }

  /**
   * Get country info by iso code
   *
   * @param iso
   */
  getCountryByIso(iso: string): Country {
    return this.countries?.find((country) => country?.iso === iso);
  }
  goBack(): any {
    this._router?.navigate([{ outlets: { detail: null } }], {
      relativeTo: this._activatedRoute?.parent,
    });
  }
  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item?.id || index;
  }

  getContactData(userId,userType,userNameToCheck?){
    // this._contactsService
    // .getContactData(userId, userType)
    // .pipe(takeUntil(this._unsubscribeAll))
    // .subscribe((contact: any) => {
    //   if(userNameToCheck){
    //     if(contact.name.toLowerCase() === userNameToCheck.toLowerCase()){
    //       console.log(contact);
    //       this.companyData = { ...this.companyData, ...contact }
    //     }
    //   } else {
    //     this.companyData = { ...this.companyData, ...contact };
    //   }
    // });
  }
  getCountryName(name: any) {
    const stateNames = this.countryValue.filter((i: any) => {
      if (i.CountryName === name) {
        return i.States;
      }
    });
    this.states = stateNames[0].States;
  }


  get editCompanyFormControl(){
    console.log(this.editCompanyForm)
    return this.editCompanyForm.controls
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.editCompanyForm.invalid) {
      return;
    }

    console.log(JSON.stringify(this.editCompanyForm.value), "==================");
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: "Hydrogen",
    weight: 1.0079,
    symbol: "H",
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
  },
  {
    position: 2,
    name: "Helium",
    weight: 4.0026,
    symbol: "He",
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`,
  },
  {
    position: 3,
    name: "Lithium",
    weight: 6.941,
    symbol: "Li",
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`,
  },
  {
    position: 4,
    name: "Beryllium",
    weight: 9.0122,
    symbol: "Be",
    description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`,
  },
  {
    position: 5,
    name: "Boron",
    weight: 10.811,
    symbol: "B",
    description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`,
  },
  {
    position: 6,
    name: "Carbon",
    weight: 12.0107,
    symbol: "C",
    description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`,
  },
  {
    position: 7,
    name: "Nitrogen",
    weight: 14.0067,
    symbol: "N",
    description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`,
  },
  {
    position: 8,
    name: "Oxygen",
    weight: 15.9994,
    symbol: "O",
    description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`,
  },
  {
    position: 9,
    name: "Fluorine",
    weight: 18.9984,
    symbol: "F",
    description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`,
  },
  {
    position: 10,
    name: "Neon",
    weight: 20.1797,
    symbol: "Ne",
    description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`,
  },
];
