import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FuseFindByKeyPipe } from "./../../../@fuse/pipes/find-by-key/find-by-key.pipe";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FuseCardModule } from "@fuse/components/card";
import { SharedModule } from "app/shared/shared.module";
import { ProfileComponent } from "./profile.component";
import { profileRoutes } from "./profile.routing";
import { FuseFindByKeyPipeModule } from "@fuse/pipes/find-by-key";
import {
  // MatDatepicker,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { I18nModule } from "app/core/i18n/i18n.module";
import { TranslateModule } from "@ngx-translate/core";
import { MatRadioModule } from "@angular/material/radio";

// import { CustomDatePipe } from "../admin/dashboards/contacts/custom-date.pipe";

@NgModule({
  declarations: [
    ProfileComponent,
    // CustomDatePipe
  ],
  imports: [
    RouterModule.forChild(profileRoutes),
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatTooltipModule,
    FuseCardModule,
    SharedModule,
    CommonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    FuseFindByKeyPipeModule,
    // I18nModule,
    TranslateModule,
  ],
  providers: [I18nModule.setLocale(), I18nModule.setLocaleId()],
})
export class ProfileModule {}
