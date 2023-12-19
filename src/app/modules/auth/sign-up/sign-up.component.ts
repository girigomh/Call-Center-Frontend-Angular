import { DatePipe } from "@angular/common";
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  NgForm,
  Validators,
  AbstractControl,
  NgSelectOption,
  FormControl,
  FormBuilder,
} from "@angular/forms";
import { Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { FuseAlertType } from "@fuse/components/alert";
import { AuthService } from "app/core/auth/auth.service";
import { UserService } from "app/core/user/user.service";
import * as countrycitystatejson from "countrycitystatejson";
import { countries } from "./countries.data";
import country from "../../utils/country-stateData.json";
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  DateAdapter,
  NativeDateAdapter,
  MatDateFormats,
} from "@angular/material/core";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import { MatSnackBar } from "@angular/material/snack-bar";
import Notiflix from "notiflix";
import { Subject, Observable, takeUntil, from } from "rxjs";
import { UserType, UserTypeClass } from "app/shared/dtos/user_type";
import { Placeholders } from "app/core/placeholder.types";
import { I18nModule } from "app/core/i18n/i18n.module";
import * as _moment from "moment";
import { default as _rollupMoment } from "moment";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import {
  CustomDateAdapter,
  CUSTOM_DATE_FORMATS,
} from "app/shared/adapters/date.adapter";
import { RegisterUserSchema } from "app/shared/dtos/RegisterUser";

// export const MY_FORMATS = {
//   parse: {
//     dateInput: "DD.MM.YYYY",
//   },
//   display: {
//     dateInput: "DD.MM.YYYY",
//     monthYearLabel: "MMM YYYY",
//     dateA11yLabel: "LL",
//     monthYearA11yLabel: "MMMM YYYY",
//   },
// };

@Component({
  selector: "auth-sign-up",
  templateUrl: "./sign-up.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  providers: [
    // { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    // { provide: MAT_DATE_LOCALE, useValue: "de" },
  ],
})
export class AuthSignUpComponent implements OnInit, OnDestroy {
  @ViewChild("signUpNgForm") signUpNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  signUpForm: UntypedFormGroup;
  showAlert: boolean = false;
  allCountries = countrycitystatejson;
  passwordStatus: string = "";
  countries = this.allCountries.getCountries();
  states: any[] = [];
  countryValue: any;
  today: any = new Date();
  types: UserTypeClass[] = [];

  maxDate: Date;
  placeholder: Placeholders;
  birthdayDate: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _userService: UserService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale("en");
    this.dateAdapter.getFirstDayOfWeek = () => { return 1}
    // Calculate the maximum date as today minus 18 years
    const today = new Date();
    this.maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    // this.dateAdapter.setLocale("en-GB"); // Change the locale to your desired one
    // this.dateAdapter.setDisplayFormat("input");
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._userService.getUserTypes().subscribe((types: UserTypeClass[]) => {
      this.types = types
        .filter((type: UserTypeClass) => type.name === "CUSTOMER")
        .map((type: UserTypeClass) => ({
          name: type.name,
          label: I18nModule.translate(type.name),
        }));
    });

    this.placeholder = new Placeholders();

    console.log(JSON.stringify(this.placeholder));
    // Create the form
    this.signUpForm = this._formBuilder.group(
      {
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        cPassword: ["", [Validators.required, Validators.minLength(8)]],
        email: ["", [Validators.required, Validators.email]],
        recoveryEmail: ["", [Validators.required, Validators.email]],
        // birthday: ["", [Validators.required]],
        birthday: ["", [Validators.required, this.minimumAgeValidator]],
        street: ["", [Validators.required]],
        houseNo: ["", [Validators.required]],
        zip: ["", [Validators.required]],
        location: ["", [Validators.required]],
        country: ["", [Validators.required]],
        gender: ["", Validators.required],
        state: ["", [Validators.required]],
        city: ["",[Validators.required]],
        username: [
          "",
          [
            Validators.required,
            Validators.pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{1,}$"),
          ],
        ],
        phoneNo: ["", [Validators.required]],
        date: [new Date()],
        // userType: ['', [Validators.required]],
        userType: ["CUSTOMER"],
        agreements: [false, [Validators.required]],
        captcha: ["", { nonNullable: true }],
      },
      { validator: [this.passwordConfirming, this.emailConfirming] }
    );
    this.countryValue = country.Countries;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getValue(event: MatDatepickerInputEvent<Date>) {
    console.log("type of", event.value);
    const eventDate = event.value.toISOString();
    const convert =
      new Date(eventDate).getMonth() +
      1 +
      "." +
      new Date(eventDate).getDate() +
      "." +
      new Date(eventDate).getFullYear();
    console.log("convert", _rollupMoment(convert));
    this.birthdayDate = _rollupMoment(convert);
    this.signUpForm.get("birthday").setValue(this.birthdayDate);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-function-return-type
  get password() {
    return this.signUpForm.get("password");
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-function-return-type
  get cPassword() {
    return this.signUpForm.get("cPassword");
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-function-return-type
  get termsAndConditions() {
    return this.signUpForm.get("agreements");
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-function-return-type
  confirmEmail() {
    if (
      this.signUpForm.get("email").value !==
      this.signUpForm.get("recoveryEmail").value
    ) {
      this.signUpForm.controls.recoveryEmail.setErrors({ notMatched: true });
      return true;
    }
    this.signUpForm.controls.recoveryEmail.setErrors(null);
    return false;
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
  //get country name
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getCountryName(name: any) {
    const stateNames = this.countryValue.filter((i: any) => {
      if (i.CountryName === name) {
        return i.States;
      }
    });
    this.states = stateNames[0].States;
  }

  getUserType(name: any): any {
    return this.types.find((i: any) => i.name === name);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign up
   */
  signUp(): void {
    // {
    //   "firstName": "string",
    //   "lastName": "string",
    //   "gender": "F",
    //   "email": "string",
    //   "dob": "2023-11-01",
    //   "username": "string",
    //   "password": "string",
    //   "phone": 0,
    //   "addressDto": {
    //     "houseNo": "string",
    //     "street": "string",
    //     "location": "string",
    //     "city": "string",
    //     "state": "string",
    //     "country": "string",
    //     "zip": "string"
    //   },
    //   "profilePhoto": "string",
    //   "titlePhoto": "string",
    //   "videoCallUrl": "string",
    //   "companyDto": {
    //     "id": 0,
    //     "name": "string"
    //   }
    // }
    let payload: RegisterUserSchema = {
      firstName: this.signUpForm.value.firstName,
      lastName: this.signUpForm.value.lastName,
      gender: this.signUpForm.value.gender,
      email: this.signUpForm.value.email,
      dob: this.signUpForm.value.birthday,
      username: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      phone: Number(this.signUpForm.value.phoneNo),
      addressDto: {
        houseNo: this.signUpForm.value.houseNo.toString(),
        zip: this.signUpForm.value.zip.toString(),
        country: this.signUpForm.value.country,
        city: this.signUpForm.value.city,
        location: this.signUpForm.value.location,
        state: this.signUpForm.value.state,
        street: this.signUpForm.value.street,
      },
      profilePhoto: '',
      titlePhoto: '',
      videoCallUrl: '',
      role: this.signUpForm.value.userType
    }

    console.log(payload,"signup payload")

    this.signUpForm.get("username").patchValue(this.signUpForm.value.email);
    // console.log("this.signUpForm", JSON.stringify(this.signUpForm.value));
    console.log("this.signUpForm", this.signUpForm.get("birthday").value);
    // Do nothing if the form is invalid
    if (this.signUpForm.invalid) {
      console.log("invalid form");
      return;
    }
    if (!this.signUpForm.value.agreements) {
      Notiflix.Notify.info(
        "Bitte akzeptiere die Allgemeinen Geschäftsbedingungen, bevor Du dich anmeldest!"
      );
      return;
    }

    // Disable the form
    this.signUpForm.disable();

    // Hide the alert
    this.showAlert = false;
    console.log(JSON.stringify(this.signUpForm.value));
    // Sign up
    this._userService.createUser(payload).subscribe(
      (response) => {
        console.log("subscribe");
        if(response.valid){
          // Navigate to the confirmation required page
          this._router.navigateByUrl("/confirmation-required");
        }
        this.signUpForm.enable();
        this.alert = {
          type: "error",
          message: "Etwas ist schief gelaufen. Bitte versuche es erneut.",
        };
        this.showAlert = true
      },
      (response) => {
        console.log("error");
        // Re-enable the form

        // Reset the form
        //this.signUpNgForm.resetForm();

        // Set the alert
        this.alert = {
          type: "error",
          message: "Etwas ist schief gelaufen. Bitte versuche es erneut.",
        };

        // Show the alert
        this.showAlert = true;
      }
    );
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

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get("password").value !== c.get("cPassword").value) {
      return { invalid: true };
    }
  }

  emailConfirming(e: AbstractControl): { invalid: boolean } {
    if (e.get("email").value !== e.get("recoveryEmail").value) {
      return { invalid: true };
    }
  }

  // onCountrySelect(country: {
  //     country: string;
  //     code: string;
  //     iso: string;
  // }): void {
  //     console.log('menu close ran' + country);
  //     this.signUpForm.get('phoneNo').setValue('+' + country.code);
  // }

  checkPassword(value: string): any {
    const mediumPassword =
      /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))/;
    const strongPassword =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    if (strongPassword.test(value)) {
      this.passwordStatus = "stark";
    } else if (mediumPassword.test(value)) {
      this.passwordStatus = "mittel";
    } else {
      this.passwordStatus = "schwach";
    }

    return this.passwordStatus;
  }

  onVerify(token: any): any {
    // The verification process was successful.
    // You can verify the token on your server now.
    this._userService.verifyCaptcha(token);
  }

  onExpired(response: any): any {
    // The verification expired.
  }

  onError(error: any): any {
    // An error occured during the verification process.
  }
}
