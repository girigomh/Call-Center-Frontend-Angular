import {
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "settings-security",
  templateUrl: "./security.component.html",
  styleUrls: ["./security.component.scss"],
})
export class SecurityComponent implements OnInit {
  changePasswordForm: UntypedFormGroup;
  changeEmailForm: UntypedFormGroup;
  twoStepForm: FormGroup;
  updateTwoFactorForm: FormGroup;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.updateTwoFactorForm = this.fb.group({
      twoStep: false, // This should be a form control for enabling 2-step authentication.
      // ... other form controls
    });
    this.updateTwoFactorForm
      .get("twoStep")
      .valueChanges.subscribe((enabled) => {
        if (enabled) {
          // If enabled, reset the two-step authentication form
          this.twoStepForm.reset();
        }
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form for change password
    this.changePasswordForm = this._formBuilder.group({
      currentPassword: [""],
      newPassword: [""],
      twoStep: [false],
      askPasswordChange: [false],
    });

    //Create the form for change email
    this.changeEmailForm = this._formBuilder.group({
      newEmail: ["", [Validators.required, Validators.email]],
    });

    // Initialize the 2-step authentication FormGroup
    this.twoStepForm = this.fb.group({
      phoneNumber: [""],
      email: [""],
      // ...
    });
    window.dispatchEvent(new Event("resize"))
  }

  requestEmailChange() {
    const newEmail = this.changeEmailForm.get("newEmail").value;
    console.log("Requesting email change for:", newEmail);
  }

  toggleTwoStep() {
    // Toggle the 2-step form when the user clicks
    if (this.updateTwoFactorForm.get("twoStep").value) {
      this.updateTwoFactorForm.get("twoStep").setValue(false);
    } else {
      this.updateTwoFactorForm.get("twoStep").setValue(true);
    }
  }

  togglePasswordChange() {
    this.router.navigate(["./sign-in"]);
  }

  saveSecurityPreferences() {}
}
