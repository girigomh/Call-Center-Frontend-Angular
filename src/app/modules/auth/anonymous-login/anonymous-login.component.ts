import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  NgForm,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { FuseAlertType } from "@fuse/components/alert";
import { AuthService } from "app/core/auth/auth.service";
// import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: "app-anonymous-login",
  templateUrl: "./anonymous-login.component.html",
  styleUrls: ["./anonymous-login.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AnonymousLoginComponent implements OnInit {
  @ViewChild("anonymousLoginNgForm") anonymousLoginNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  anonymousLoginForm: UntypedFormGroup;
  showAlert: boolean = false;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router // private _authService: AuthService, // private _formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentToken");
    localStorage.removeItem("futureToken");
    // Create the form
    this.anonymousLoginForm = this._formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", Validators.required],
      //rememberMe: ['']
    });
  }
  anonymousLogin(): void {
    // Return if the form is invalid
    if (this.anonymousLoginForm.invalid) {
      return;
    }
    // Disable the form
    this.anonymousLoginForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Sign in
    this._authService.signIn(this.anonymousLoginForm.value).subscribe({
      next: (x) => this.handlesAuthSuccess(x),
      error: () => this.handleAuthError(),
      // complete: (x) => this.handlesAuthSuccess(x),
    });
  }
  handlesAuthSuccess(x: any): void {
    console.log(x);
    // Set the redirect url.
    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
    // to the correct page after a successful sign in. This way, that url can be set via
    // routing file and we don't have to touch here.
    const redirectURL = "/call";
    // this._activatedRoute.snapshot.queryParamMap.get("redirectURL") ||
    // "/signed-in-redirect";

    // Navigate to the redirect url
    this._router.navigateByUrl(redirectURL);
  }
  handleAuthError(): void {
    this.anonymousLoginForm.enable();

    // Reset the form
    this.anonymousLoginNgForm.resetForm();

    // Set the alert
    this.alert = {
      type: "error",
      message: "falsche Email oder Passwort",
    };

    // Show the alert
    this.showAlert = true;
  }
}
