import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FuseAlertModule } from "./../../../../@fuse/components/alert/alert.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SharedModule } from "./../../../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FuseDrawerModule } from "@fuse/components/drawer";
import { SettingsComponent } from "app/layout/common/settings/settings.component";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AccountComponent } from "./account/account.component";
import { NotificationComponent } from "./notification/notification.component";
import { PlanBillingComponent } from "./plan-billing/plan-billing.component";
import { SecurityComponent } from "./security/security.component";
import { TeamComponent, AddMemberFormComponent } from "./team/team.component";
import { MatRadioModule } from "@angular/material/radio";
import { MatDialogModule } from "@angular/material/dialog";
import { LanguageComponent } from "./language/language.component";
import { VideoCallComponent } from "./video-call/video-call.component";
import { I18nModule } from "app/core/i18n/i18n.module";

@NgModule({
  declarations: [
    SettingsComponent,
    AccountComponent,
    NotificationComponent,
    PlanBillingComponent,
    SecurityComponent,
    TeamComponent,
    AddMemberFormComponent,
    LanguageComponent,
    VideoCallComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    FuseDrawerModule,
    FuseAlertModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    SharedModule,
  ],
  exports: [SettingsComponent],
  providers: [I18nModule.setLocale(), I18nModule.setLocaleId()],
})
export class SettingsModule {}
