/* eslint-disable max-len */
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
// import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Placeholders } from 'app/core/placeholder.types';
import * as countrycitystatejson from 'countrycitystatejson';
import country from '../../../../utils/country-stateData.json';
import { MatChipInputEvent } from '@angular/material/chips';
import { UserService } from 'app/core/user/user.service';
import { I18nModule } from 'app/core/i18n/i18n.module';
import { ContactService } from '../contacts.service';
import { CustomersService } from '../../customers/customers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { combineLatest, map } from 'rxjs';
import { UserType, UserTypeClass } from 'app/shared/dtos/user_type';
import { CompanyHoursModalComponent } from '../company-hours-modal/company-hours-modal.component';
import { DateAdapter } from '@angular/material/core';
import { CompanyPayload, CompanyService } from '../../company/company.service';
import { ApiResponse, Globals } from 'app/shared/global/globals';
import { Observable } from 'ol';

@Component({
  selector: 'app-add-contact-form',
  templateUrl: './add-contact-form.component.html',
  styleUrls: ['./add-contact-form.component.scss'],
})
export class AddContactFormComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('userDetailFormTemplate') userDetailFormTemplate: TemplateRef<any>;
  @ViewChild('addressFormTemplate') addressFormTemplate: TemplateRef<any>;
  @ViewChild('additionalInfoFormTemplate')
  additionalInfoFormTemplate: TemplateRef<any>;
  @ViewChild('companyDetailFormTemplate')
  companyDetailFormTemplate: TemplateRef<any>;
  @ViewChild('companyLeaderDetailFormTemplate')
  companyLeaderDetailFormTemplate: TemplateRef<any>;
  @ViewChild('fromCompanyTemplate')
  fromCompanyTemplate: TemplateRef<any>;
  @ViewChild('finalStepTemplate') finalStepTemplate: TemplateRef<any>;
  // @Output() dialogClosed = new EventEmitter<any>();
  openingHoursOptions: string[] = [
    'Mon: 07:00',
    'Tue: 08:00',
    'Wed: 09:00',
    'Thu: 07:00',
    'Fri: 08:00',
    'Sat: 09:00',
    'Sun: Closed',
    // "16:00",
  ];
  globals = new Globals();
  steps: any;
  filteredOptions: Observable;
  showAlert: boolean =false
  alert: { message: string};
  companyDetailForm: FormGroup; 
  addCategoryForm: FormGroup;
  roles = this.globals.Roles;
  userDetailForm: FormGroup;
  userTypeControl: FormControl;
  addressForm: FormGroup;
  additionalInfoForm: FormGroup;
  companyLeaderDetailForm: FormGroup;
  countryValue: any;
  passwordStatus: string = '';
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  knoladgeTopics: any = [];
  allCountries = countrycitystatejson;
  placeholder: Placeholders;
  countries = this.allCountries.getCountries();
  states: any;
  categoriesList = [];

  // eslint-disable-next-line max-len
  defImg: any =
    'https://st2.depositphotos.com/4111759/12123/v/600/depositphotos_121233262-stock-illustration-male-default-placeholder-avatar-profile.jpg';
  types: UserTypeClass[];
  companies: any[];
  infoForm: any;
  maxDate: Date;
  fromCompanyForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private _contactsService: ContactService,
    private _customerService: CustomersService,
    private _companyService: CompanyService,
    private dialog: MatDialog,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private dateAdapter: DateAdapter<any> // @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  // isFormValid = false;

  ngOnInit(): void {
    this.types = [];
    this.dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    };
    // eslint-disable-next-line @typescript-eslint/semi, max-len
    let types = [
      { name: 'captioner', label: I18nModule.translate('CAPTIONER') },
      {
        name: 'communication_assistance',
        label: I18nModule.translate('COMMUNICATIONASSISTENCE'),
      },
      { name: 'interpreter', label: I18nModule.translate('INTERPRETER') },
      { name: 'company_leader', label: I18nModule.translate('COMPANYLEADER') },
      {
        name: 'switching_center_leader',
        label: I18nModule.translate('SWITCHINGCALLCENTERLEADER'),
      },
      { name: 'company', label: I18nModule.translate('COMPANY') },
    ];
    this.types = types;
    this._companyService.getAllCompanies().subscribe((companyList: any) => {
      this.companies = companyList;
    });
    this.userTypeControl = new FormControl(null, Validators.required);

    this.addCategoryForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.userDetailForm = this._fb.group({
      profilePhoto: [null],
      titlePhoto: [null],
      firstName: ['Kawaman', Validators.required],
      lastName: ['mail', Validators.required],
      dob: [
        [2070, 5, 25, 14, 22, 56],
        [Validators.required, this.minimumAgeValidator],
      ],
      phone: [
        '+359885828235',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13),
        ],
      ],
      gender: ['', Validators.required],
      email: ['kawaman@mail.sb', [Validators.email, Validators.required]],
      userType: ['', Validators.required],
      username: [''],
      // password: ["", [Validators.required]],
      password: ['password', [Validators.required, Validators.minLength(8)]],
      cPassword: ['password', [Validators.required, Validators.minLength(8)]],
    });
    this.addressForm = this._fb.group({
      houseNo: ['7', Validators.required],
      street: ['Пловдивско шосе', Validators.required],
      location: ['kkk', Validators.required],
      city: ['Sofia', Validators.required],
      zip: ['1164', Validators.required],
      country: ['ABC', Validators.required],
      state: [],
    });
    this.additionalInfoForm = this._fb.group(
      {
        // for info
        topicKnowladge: ['', Validators.required],
        certificate: ['', Validators.required],
        linkForVideocall: ['', [Validators.required]],
        // for Bank
        bankName: ['', Validators.required],
        bankDetails: ['', Validators.required],
        bankData: ['', Validators.required],
        paymentInterval: ['', Validators.required],
      }
      //  { validator: [this.passwordConfirming, this.emailConfirming] };
    );

    this.companyDetailForm = this._fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      url: ['Url', Validators.required],
      linkForVideoCall: ['Link For Video Call', Validators.required],
      email: ['email_of_company5@comp5.mail.com', Validators.required],
      openingHours: ['', Validators.required],
      description: ['Description', Validators.required],
      companyAddress: ['Home address', Validators.required],
      invoice: [{ value: 'invoice', disabled: true }, Validators.required],
      type: ['', Validators.required],
      videoCallEmployee: ['', Validators.required],
      videoCallLeader: ['', Validators.required],
    });
    this.companyLeaderDetailForm = this._fb.group({
      companyLeaderLinkForVideoCall: [null, [Validators.required]],
      company: ['', [Validators.required]],
      companyId: [
        this.companyDetailForm.get('name').value,
        [Validators.required],
      ],
    });
    this.fromCompanyForm = this._fb.group({
      company: ['', Validators.required],
      videoCallUrl: ['', Validators.required],
    });

    this.placeholder = new Placeholders();

    this.countryValue = country.Countries;
    const today = new Date();
    this.maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    this._companyService.getAllCategories().subscribe((categoriesData) => {
      this.categoriesList = categoriesData;
      console.log(this.categoriesList);
    });
  }
  // allStatesControl = new FormControl(null);

  addInterpreter(): any {
    this.userDetailForm.patchValue({
      username: this.userDetailForm.get('email').value,
    });
    this.companyDetailForm.patchValue({
      email: this.userDetailForm.get('email').value,
    });
    this.additionalInfoForm.patchValue({
      paymentInterval: this.additionalInfoForm
        .get('paymentInterval')
        .value.split(','),
    });

    const payload = {
      ...this.userDetailForm.value,
      ...this.additionalInfoForm.value,
      ...this.addressForm.value,
      ...this.companyDetailForm.value,
      ...this.companyLeaderDetailForm.value,
      topicKnowledge: this.knoladgeTopics,
    };
    console.log(payload);
    console.log(payload);
    this._contactsService.createContact(payload).subscribe((newContact) => {
      // // newContact = payload;
      // this.dialogRef.close({ newContact: newContact });
      // console.log(JSON.stringify(newContact));
      // // Go to the new contact
      // this._router.navigate(['./', newContact.userId], {
      //   relativeTo: this._activatedRoute,
      // });
    });
  }

  // Function to open the userDetailForm step
  openUserDetailForm() {
    this.stepper.selectedIndex = 2;
  }

  // Function to open the companyDetailForm step
  openCompanyDetailForm() {
    this.stepper.selectedIndex = 1;
  }

  get password() {
    return this.userDetailForm.get('password');
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-function-return-type
  get cPassword() {
    return this.userDetailForm.get('cPassword');
  }
  // closeDialog(result: any): void {
  //   this.dialogClosed.emit(result);
  // }

  addContact(): void {

``

    console.log(
      this.categoriesList.filter((ele) => ele.name === this.companyDetailForm.value.category),
      '::this.companyDetailForm.value::'
    );

    this.userDetailForm.patchValue({
      username: this.userDetailForm.get('email').value,
    });
    this.companyDetailForm.patchValue({
      email: this.userDetailForm.get('username').value,
    });
    if (this.userTypeControl.value === 'company') {
      let comapanyPayload: CompanyPayload = {
        companyCategoryId: this.categoriesList.filter((ele) => ele.name === this.companyDetailForm.value.category)[0].id,
        name: this.companyDetailForm.value.name,
        email: this.companyDetailForm.value.email,
        websiteUrl: this.companyDetailForm.value.url,
        videoCallUrl: this.companyDetailForm.value.linkForVideoCall,
        description: this.companyDetailForm.value.description,
        openHours: this.companyDetailForm.value.openingHours+":00",
        type: this.companyDetailForm.value.type,
        videoCallEmployee: this.companyDetailForm.value.videoCallEmployee,
        videoCallLeader: this.companyDetailForm.value.videoCallLeader,
      };
      console.log(comapanyPayload)
      this._companyService.createCompany(comapanyPayload).subscribe((response:ApiResponse) => {
        if(!response.valid){
          this.alert.message = "something went wrong! please try again"
          this.showAlert = true
          return
        }
        this._router.navigate(['/dashboard/contacts'])
      })
      return
    }

    let payload = {
      ...this.userDetailForm.value,
      addressDto: this.addressForm.value,
      phone: Number(this.userDetailForm.value.phone),
      dob: new Date(this.userDetailForm.value.dob).toISOString(),
      companyDto: this.fromCompanyForm.value.company,
      videoCallUrl: this.fromCompanyForm.value.videoCallUrl,
    };

    // console.log(users);
    delete payload.cPassword;
    console.log(JSON.stringify(payload));
    this._userService
    .createUser({
      ...payload,
      role: this.userTypeControl.value.toLowerCase(),
    })
    .subscribe(
      (response:ApiResponse) => {
        console.log(response, '::resposne::');
        if (response.valid) {
          this._router.navigate(['/dashboard/contacts']);
        }
      },
      (error) => {
        console.log('error', error);
      }
    );

    // this._contactsService
    //   // .createContact(users)
    //   .createContact({
    //     ...payload,
    //   })
    //   .subscribe((newContact) => {
    //     Object.assign(newContact, payload); // Merge payload data with newContact

    //     if (
    //       this.userTypeControl.value === 'COMPANY' ||
    //       !this.userDetailForm.invalid ||
    //       !this.addressForm.invalid ||
    //       !this.companyDetailForm.invalid
    //     ) {
    //       console.log(this.userTypeControl.value);
    //       this.userDetailForm.reset();
    //       this.addressForm.reset();
    //       this.userTypeControl.setValue('COMPANYLEADER');
    //       this.userDetailForm.patchValue({
    //         userType: 'COMPANYLEADER',
    //       });
    //       this.companyLeaderDetailForm.patchValue({
    //         // companyId: newContact.userId,
    //         company: newContact,
    //       });
    //       this.steps = [];
    //       this.steps.push({
    //         label: 'Add Company leader',
    //         content: this.userDetailFormTemplate,
    //       });
    //       this.steps.push({
    //         label: 'Company leader address',
    //         content: this.addressFormTemplate,
    //       });
    //       this.steps.push({
    //         label: 'Company leader details',
    //         content: this.companyLeaderDetailFormTemplate,
    //       });
    //       return;
    //     }
    //     // this.dialogRef.close();
    //     return;

    //     if (newContact && newContact.userId) {
    //       // Go to the new contact
    //       this._router.navigate(['/dashboard/contacts', newContact.userId]);
    //     }
    //   });
 
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('cPassword').value) {
      return { invalid: true };
    }
  }

  checkPassword(value: string): any {
    const mediumPassword =
      /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))/;
    const strongPassword =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    if (strongPassword.test(value)) {
      this.passwordStatus = 'stark';
    } else if (mediumPassword.test(value)) {
      this.passwordStatus = 'mittel';
    } else {
      this.passwordStatus = 'schwach';
    }

    return this.passwordStatus;
  }

  // z
  getCountryName(name: any): any {
    const stateNames = this.countryValue.filter((i: any) => {
      if (i.CountryName === name) {
        return i.States;
      }
    });
    this.states = stateNames[0].States;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.knoladgeTopics.push(value);
    }

    // Clear the input value
    event.chipInput?.clear();
  }

  remove(fruit: any): void {
    const index = this.knoladgeTopics.indexOf(fruit);

    if (index >= 0) {
      this.knoladgeTopics.splice(index, 1);
    }
  }
  getExpectedDate(date: any): any {
    const nDate = [
      new Date(date).getFullYear(),
      new Date(date).getMonth(),
      new Date(date).getDate(),
      new Date(date).getHours(),
      new Date(date).getMinutes(),
      new Date(date).getSeconds(),
    ];
    return nDate;
  }

  onCompanySelectionChange() {
    console.log(this.companyLeaderDetailForm.get('companyId').value);
    console.log(this.companyLeaderDetailForm.get('companyId').errors);
    // TODO: get company detail and display them in the dialog
    let company = this._customerService
      .getBusinessObject(
        this.companyLeaderDetailForm.get('companyId').value,
        'COMPANY'
      )
      .subscribe((newCompany) => {
        console.log(JSON.stringify(newCompany));
        this.companyLeaderDetailForm.patchValue({
          company: newCompany,
        });
      });
  }

  onUserTypeSelectionChange() {
    // Get the value from the userTypeControl
    const userTypeValue = this.userTypeControl.value;

    this.steps = [];
    if (this.userTypeControl.value !== 'company') {
      this.steps.push({
        label: 'Main Details',
        content: this.userDetailFormTemplate,
      });
      this.steps.push({
        label: 'Address Details',
        content: this.addressFormTemplate,
      });
      this.steps.push({
        label: 'Company',
        content: this.fromCompanyTemplate,
      });
    }

    switch (userTypeValue) {
      case 'interpreter':
        this.steps.push({
          label: 'Additional Details',
          content: this.additionalInfoFormTemplate,
        });

        break;
      case 'captioner':
        break;
      case 'communication_assistance':
        break;
      case 'company':
        this.steps.push({
          label: 'Company Details',
          content: this.companyDetailFormTemplate,
        });
        break;
      case 'compnay_leader':
        // this.steps.push({
        //   label: 'Company Leader Details',
        //   content: this.companyLeaderDetailFormTemplate,
        // });
        break;
      default:
      case null:
        this.steps = null;
        throw Error('Unknown userType: ' + userTypeValue);
    }

    // this.steps.push({ label: 'Final Step', content: this.finalStepTemplate });

    // Update the 'userType' field in the userDetailForm form group
    this.userDetailForm.patchValue({ userType: userTypeValue });

    console.log(this.userDetailForm.get('userType').value);
    console.log(this.userDetailForm.get('userType').errors);
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

  openTimeModal() {
    const dialogRef = this.dialog.open(CompanyHoursModalComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }
  companySelectionChange(value) {
    console.log(value, '::value::', this.fromCompanyForm.value);
    if (value === 'createCompany') {
      this.steps = null;
      this.userTypeControl.setValue('company');
      this.onUserTypeSelectionChange();
    }
  }

  openCategoryAddModal(template) {
    const dailogRef = this.dialog.open(template, {
      width: '600px',
    });
    dailogRef.afterClosed().subscribe(() => {
      if (this.addCategoryForm.invalid) {
        return;
      }
      this._companyService
        .createCategory(this.addCategoryForm.value)
        .subscribe((response: any) => {
          this.categoriesList.push(response.data);
        });
    });
  }

  OnHumanSelected(option: any) {
    this.companyDetailForm.get('category').setValue(option.value)
  }
}
