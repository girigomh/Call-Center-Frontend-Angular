import { DateAdapter } from "@angular/material/core";
import { Placeholders } from "./../../../../core/placeholder.types";
import { countries } from "./../../../../modules/auth/sign-up/countries.data";
import {
  Validators,
  UntypedFormGroup,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import * as countrycitystatejson from "countrycitystatejson";
import { featchUserRole } from "./../../../../mock-api/common/navigation/check";
import { Component, OnInit, Inject } from "@angular/core";
import country from "../../../../modules/utils/country-stateData.json";
import { AuthService } from "app/core/auth/auth.service";
import { TeamMemberService } from "app/shared/team-member-service.service";
// import { DomSanitizer } from "@angular/platform-browser";
@Component({
  selector: "settings-team",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.scss"],
})
export class TeamComponent implements OnInit {
  members: any[];
  roles: any[];
  show: boolean;
  member: any;
  formData: any;
  dialogRef: any;
  // authService: any;

  /**
   * Constructor
   */
  constructor(
    public dialog: MatDialog,
    private teamMemberService: TeamMemberService,
    private _authService: AuthService // private domSanitizer: DomSanitizer
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Retrieve stored member data from localStorage
    const storedMembers = localStorage.getItem("members");
    this.members = storedMembers ? JSON.parse(storedMembers) : [];
    // Setup the team members
    // this.members = [
    //   {
    //     avatar: "assets/images/avatars/male-01.jpg",
    //     name: "Dejesus Michael",
    //     email: "dejesusmichael@mail.org",
    //     role: "admin",
    //     id: 1,
    //   },
    //   {
    //     avatar: "assets/images/avatars/male-03.jpg",
    //     name: "Mclaughlin Steele",
    //     email: "mclaughlinsteele@mail.me",
    //     role: "companyleader",
    //     id: 2,
    //   },
    //   {
    //     avatar: "assets/images/avatars/female-02.jpg",
    //     name: "Laverne Dodson",
    //     email: "lavernedodson@mail.ca",
    //     role: "switchingcentreemployee",
    //     id: 3,
    //   },
    //   {
    //     avatar: "assets/images/avatars/female-03.jpg",
    //     name: "Trudy Berg",
    //     email: "trudyberg@mail.us",
    //     role: "companyemployee",
    //     id: 4,
    //   },
    //   {
    //     avatar: "assets/images/avatars/male-07.jpg",
    //     name: "Lamb Underwood",
    //     email: "lambunderwood@mail.me",
    //     role: "admin",
    //     id: 5,
    //   },
    //   {
    //     avatar: "assets/images/avatars/male-08.jpg",
    //     name: "Mcleod Wagner",
    //     email: "mcleodwagner@mail.biz",
    //     role: "switchingcentreemployee",
    //     id: 6,
    //   },
    //   {
    //     avatar: "assets/images/avatars/female-07.jpg",
    //     name: "Shannon Kennedy",
    //     email: "shannonkennedy@mail.ca",
    //     role: "switchingcentreleader",
    //     id: 7,
    //   },
    // ];

    // Setup the roles
    this.roles = [
      /*{
                label: 'Read',
                value: 'read',
                description: 'Can read and clone this repository. Can also open and comment on issues and pull requests.'
            },
            {
                label: 'Write',
                value: 'write',
                description: 'Can read, clone, and push to this repository. Can also manage issues and pull requests.'
            },*/
      {
        // only Admin itself can add admin, company-leader and switchingcentre-leader.
        label: "Admin",
        value: "admin",
        description:
          "Can read, clone, and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.",
      },
      {
        // only Company-Leader can add company employee and company-leader
        label: "Company-Leader",
        value: "companyleader",
        description:
          "Can read, clone, and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.",
      },
      {
        label: "Copmany-Employee",
        value: "companyemployee",
        description:
          "Can read, clone, and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.",
      },
      {
        // only Leader can add leader and employee
        label: "SwitchingCenter-Leader",
        value: "switchingcentreleader",
        description:
          "Can read, clone, and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.",
      },
      {
        label: "SwitchingCenter-Employee",
        value: "switchingcentreemployee",
        description:
          "Can read, clone, and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.",
      },
    ];
    const role = featchUserRole();
    // eslint-disable-next-line max-len
    this.show = ![
      "ANONYMOUS",
      "COMPANYEMPLOYEE",
      "SWITCHINGCENTEMPLOYEE",
      "CAPTIONER",
      "COMMUNICATIONASSISTENCE",
      "CUSTOMER",
    ].includes(role);
    window.dispatchEvent(new Event("resize"))

  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  //   addMember(member: any): void {
  //     console.log(member.value);
  //     // this.member.value;
  //     const sendData = {
  //       // ID: integer
  //       // Vorname (firstname): String
  //       // Nachname (family name): String
  //       // Geburtstag (Birthday): Date
  //       // Geschlecht (male/female): String[]
  //       // Strasse (company street): String
  //       // Hausnummer (company number): String
  //       // PLZ (Zip company): Integer
  //       // Ort (company location): String
  //       // Land (company country): String[]
  //       // Email: String
  //       // Telefonnr. (Phone number): String
  //       // Datenordner (Datas): File
  //       // Foto (photo): File
  //       // Online-Status: String[]
  //       // Zeitdauer (term): Time
  //       // create-time: Date
  //       // update-time: Date
  //       // URL: String
  //       // Link for Videocall: String
  //       // Company name: String
  //     };
  //     const data = {
  //       avatar: "",
  //       name: member.value,
  //       email: `${member.value.replace(/\s/g, "")}@mail.ca`,
  //       role: "",
  //     };
  //     this.members.push(data);
  //   }
  //   openDialog(): void {
  //     const dialogRef = this.dialog.open(AddMemberFormComponent);

  //     dialogRef.afterClosed().subscribe((result) => {
  //       console.log("Dialog result: ${result}", result);
  //     });
  //   }

  // addMember(member: any): void {
  //   console.log(member.value);
  //   const data = {
  //     avatar: "",
  //     name: member.value,
  //     email: `${member.value.replace(/\s/g, "")}@mail.ca`,
  //     role: "",
  //   };
  //   this.members.push(data);

  addMember(member: any): void {
    const dialogRef = this.dialog.open(AddMemberFormComponent, {
      data: member.value,
    });

    const data = {
      avatar: "",
      name: member.value,
      email: `${member.value.replace(/\s/g, "")}@mail.ca`,
      role: "",
    };

    // Add the new member to the teamMemberService
    this.teamMemberService.addTeamMember(data);

    // Add the new member to the array
    this.members.push(data);

    // Store the updated member data in localStorage
    localStorage.setItem("members", JSON.stringify(this.members));

    // Close the dialog
    dialogRef.close();
  }

  // addMember(member: any): void {
  //   const dialogRef = this.dialog.open(AddMemberFormComponent, {
  //     data: member.value,
  //   });

  //   const data = {
  //     avatar: "",
  //     name: member.value,
  //     email: `${member.value.replace(/\s/g, "")}@mail.ca`,
  //     role: "",
  //   };

  //   // Add the new member to the teamMemberService
  //   this.teamMemberService.addTeamMember(member);
  //   // Add the new member to the array
  //   this.members.push(data);
  //   console.log(this.members);
  //   // Store the updated member data in localStorage
  //   localStorage.setItem("members", JSON.stringify(this.members));
  //   this.dialogRef.close(data);
  // }

  openDialog(): void {
    // Get the type of user that is logged in
    // const userType = this._authService.getUserRole();
    const userType = "admin";

    console.log(userType);

    if (!userType) {
      return;
    }

    // Define a mapping of user types to allowed member roles
    const allowedRoles = {
      admin: [
        // "ADMIN",
        "COMPANYLEADER",
        "SWITCHINGCALLCENTERLEADER",
        "COMPANYEMPLOYEE",
      ],
      companyleader: ["COMPANYLEADER", "COMPANYEMPLOYEE"],
      companyemployee: ["COMPANYEMPLOYEE"],
    };

    // Check if the current user is allowed to add members
    if (allowedRoles[userType].length > 0) {
      const dialogRef = this.dialog.open(AddMemberFormComponent);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // Display the form data on the browser
          console.log(result);
          this.members.push(result);
          localStorage.setItem("members", JSON.stringify(this.members));
          // this.dialogRef.close(data);
          console.log(this.members);

          // You can update the UI or perform any desired action with the form data here
          // For example, you can assign it to a property and display it in the template
          this.formData = result;
        } else {
          console.log("Dialog closed without result");
        }
      });
    } else {
      console.log("User is not allowed to add members");
    }
  }

  removeTeamMember(id: any): void {
    this.members = this.members.filter((member: any) => member.id == id);

    // Update the stored member data in localStorage after removing a member
    localStorage.setItem("members", JSON.stringify(this.members));
  }
}

// removeTeamMember(id: any): any {
//     this.members = this.members.filter((member: any) => member.id !== id);
// }

//   removeTeamMember(id: any, currentUser: any): void {
//     if (currentUser && currentUser?.role === "admin") {
//       this.members = this.members.filter((member: any) => member.id !== id);
//     } else {
//       console.error("Unauthorized: Only admins can remove team members");
//     }
//   }
// }
//  team member data schema
// ID: integer
// Vorname (firstname): String
// Nachname (family name): String
// Geburtstag (Birthday): Date
// Geschlecht (male/female): String[]
// Strasse (company street): String
// Hausnummer (company number): String
// PLZ (Zip company): Integer
// Ort (company location): String
// Land (company country): String[]
// Email: String
// Telefonnr. (Phone number): String
// Datenordner (Datas): File
// Foto (photo): File
// Online-Status: String[]
// Zeitdauer (term): Time
// create-time: Date
// update-time: Date
// URL: String
// Link for Videocall: String
// Company name: String

@Component({
  selector: "app-add-member-form",
  templateUrl: "./add-member-form/add-member-form.component.html",
  styleUrls: ["./add-member-form/add-member-form.component.scss"],
})
export class AddMemberFormComponent implements OnInit {
  //  signUpForm: any;
  signUpForm: UntypedFormGroup;
  today: any = new Date();
  countryValue: any;
  passwordStatus: string = "";
  allCountries = countrycitystatejson;
  placeholder: Placeholders;
  countries = this.allCountries.getCountries();
  states: any;
  isEmployee: boolean = ["COMPANYEMPLOYEE"].includes(featchUserRole());
  constructor(
    private teamMemberService: TeamMemberService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddMemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.signUpForm = this._formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      userRole: ["", [Validators.required]],
      birthday: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      userType: ["", [Validators.required]],
      dataFile: [""],
      email: ["", [Validators.required, Validators.email]],
      onlineStatus: ["", [Validators.required]],
      term: ["", [Validators.required]],
      url: ["", [Validators.required]],
      videoCallLink: [""],
      companyName: ["", [Validators.required]],
      profilePhoto: [""],
      companyStreet: ["", [Validators.required]],
      password: ["password", [Validators.required, Validators.minLength(8)]],
      cPassword: ["password", [Validators.required, Validators.minLength(8)]],
      companyNo: ["", [Validators.required]],
      companyZip: ["", [Validators.required]],
      companyLocation: ["", [Validators.required]],
      companyCountry: ["", [Validators.required]],
      phoneNo: ["", [Validators.required]],
      date: [new Date()],
    });
    this.countryValue = country.Countries;
  }

  ngOnInit(): void {
    console.log(this.countryValue, country);
    this.placeholder = new Placeholders();
  }

  getCountryName(name: any): any {
    const stateNames = this.countryValue.filter((i: any) => {
      if (i.CountryName === name) {
        return i.States;
      }
    });
    this.states = stateNames[0].States;
  }
  get password() {
    return this.signUpForm.get("password");
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-function-return-type
  get cPassword() {
    return this.signUpForm.get("cPassword");
  }
  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get("password").value !== c.get("cPassword").value) {
      return { invalid: true };
    }
  }

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

  addMember(member: any): void {
    // ... existing code ...
    this.data = member.data;
    // Update the data property with the new member data
    this.data = member.value;

    // Add the new member to the teamMemberService
    this.teamMemberService.addTeamMember(this.data);

    // Close the dialog
    this.dialogRef.close(this.data);
  }
}
