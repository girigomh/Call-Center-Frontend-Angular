import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: "auth-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuthSignInComponent implements OnInit {
  allowAnonymous: boolean = false;
  anonymousButtonLink: string = "/anonymous-login";
  @ViewChild("signInNgForm") signInNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  signInForm: UntypedFormGroup;
  showAlert: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    const externalLink =
      this._activatedRoute.snapshot.queryParamMap.get("externalLink");
    this.allowAnonymous = externalLink !== null;

    // Update the anonymous button link if needed
    if (this.allowAnonymous) {
    //   this.anonymousButtonLink = externalLink;
    }

    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentToken");
    localStorage.removeItem("futureToken");
    // Create the form
    this.signInForm = this._formBuilder.group({
      email: ["", [Validators.required]],
      pwd: ["", Validators.required],
      //rememberMe: ['']
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   */
  signIn(): void {
    // Return if the form is invalid
    if (this.signInForm.invalid) {
      return;
    }

    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Sign in
    this._authService.signIn(this.signInForm.value).subscribe({
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
    const redirectURL =
      this._activatedRoute.snapshot.queryParamMap.get("redirectURL") ||
      "/signed-in-redirect";

    // Navigate to the redirect url
    this._router.navigateByUrl(redirectURL);
  }

  handleAuthError(): void {
    this.signInForm.enable();

    // Reset the form
    this.signInNgForm.resetForm();

    // Set the alert
    this.alert = {
      type: "error",
      message: "falsche Email oder Passwort",
    };

    // Show the alert
    this.showAlert = true;
  }
}
