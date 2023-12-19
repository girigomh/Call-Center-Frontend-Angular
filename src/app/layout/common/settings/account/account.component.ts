import {
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup,
} from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { TeamMemberService } from "app/shared/team-member-service.service";
import { I18nModule } from "app/core/i18n/i18n.module";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "settings-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent implements OnInit {
  // languages: string[] = ["English", "German", "Spanish"];
  selectedLanguage: string;
  accountForm: UntypedFormGroup;
  userType: string = "CUSTOMER";
  languages: string[] = [
    "English",
    "Spanish",
    "French",
    "German",
    "Latin",
    "Greek",
    "Chinese",
  ];
  countries: string[] = [
    "USA",
    "Canada",
    "UK",
    "China",
    "Japan",
    "Ukraine",
    "Belgium",
    "Russia",
    "Italy",
    "Australia",
    "Germany",
    "Austria",
    "Netherlands",
    "Switzerland",
    "Nigeria",
    "France",
  ];
  userProfileData: any;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private TeamMemberService: TeamMemberService,
    private translateService: TranslateService
  ) {
    this.translateService.use("en");
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    const translatedLabel = this.translateService.instant("language");
    console.log(translatedLabel);
    // Create the form
    this.accountForm = this._formBuilder.group({
      name: ["Brian Hughes"],
      username: ["brianh"],
      title: ["Senior Frontend Developer"],
      // company: ["Adroit Software"],
      about: [
        "Hey! This is Brian; husband, father and gamer. I'm mostly passionate about bleeding edge tech and chocolate! 🍫",
      ],
      email: ["hughes.brian@mail.com", Validators.email],
      phone: ["121-490-33-12"],
      country: ["USA"],
      language: ["English"],
      verification: [""],
    });
    this.loadUserProfileDataFromLocalStorage();
    window.dispatchEvent(new Event("resize"))

  }

  onFormSubmit(): void {
    this.userProfileData = this.accountForm.value;

    this.TeamMemberService.setUserProfileData(this.userProfileData);
    // localStorage.setItem("userData", JSON.stringify(this.userData));

    console.log("Form data saved to local storage:", this.userProfileData);
  }
  changeLanguage(language: string) {
    this.selectedLanguage = language;
    this.translateService.use(language);
  }

  loadUserProfileDataFromLocalStorage(): void {
    const userProfileDataJson = localStorage.getItem("userProfileData");
    if (userProfileDataJson) {
      this.userProfileData = JSON.parse(userProfileDataJson);
      this.accountForm.patchValue(this.userProfileData);
    }
  }
  // toggleColor = "warn";
  // toggleState = false;
  // toggleLanguage(language: string) {
  //   this.toggleState = !this.toggleState;
  //   this.toggleColor = this.toggleState ? "secondary" : "warn";
  // }
}
