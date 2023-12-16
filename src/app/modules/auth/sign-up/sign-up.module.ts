import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FuseCardModule } from "@fuse/components/card";
import { FuseAlertModule } from "@fuse/components/alert";
import { SharedModule } from "app/shared/shared.module";
import { AuthSignUpComponent } from "app/modules/auth/sign-up/sign-up.component";
import { authSignupRoutes } from "app/modules/auth/sign-up/sign-up.routing";
import {
  MatDatepickerModule,
  MatStartDate,
} from "@angular/material/datepicker";
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NgHcaptchaModule } from "ng-hcaptcha";
import { LanguagesModule } from "app/layout/common/languages/languages.module";
import { MatRadioModule } from "@angular/material/radio";
import { CUSTOM_DATE_FORMATS } from "app/shared/adapters/date.adapter";

@NgModule({
  declarations: [AuthSignUpComponent],
  imports: [
    RouterModule.forChild(authSignupRoutes),
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FuseCardModule,
    FuseAlertModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    LanguagesModule,
    NgHcaptchaModule.forRoot({
      siteKey: "10000000-ffff-ffff-ffff-000000000001",
    }),
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: CUSTOM_DATE_FORMATS,
      // provide: MAT_DATE_LOCALE,
    },
  ],
})
export class AuthSignUpModule {}
