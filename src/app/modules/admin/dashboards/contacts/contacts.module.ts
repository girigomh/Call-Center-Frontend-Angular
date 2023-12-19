import { OverlayModule } from "@angular/cdk/overlay";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ContactsRoutingModule } from "./contacts-routing.module";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { ContactDescriptionComponent } from "./contact-description/contact-description.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatLuxonDateModule } from "@angular/material-luxon-adapter";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FuseFindByKeyPipeModule } from "@fuse/pipes/find-by-key";
import { SharedModule } from "app/shared/shared.module";
import { AddContactFormComponent } from "./add-contact-form/add-contact-form.component";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { MatStepperModule } from "@angular/material/stepper";
import { MatChipsModule } from "@angular/material/chips";
import { Ng2SearchPipeModule } from "ng2-search-filter";
// import { SearchFilterPipe } from "app/modules/utils/pipes/search-filter.pipe";
import {
  CHECKBOX_CONFIG,
  CheckboxConfig,
} from "./contact-list/checkbox-config";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CustomDatePipe } from "./custom-date.pipe";
import { FilterByUserTypePipe } from "../company/filter-usertype.pipe";
import { MatDialogModule } from "@angular/material/dialog";
import { CompanyHoursModalComponent } from "./company-hours-modal/company-hours-modal.component";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { FuseAlertModule } from "@fuse/components/alert";

// import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  providers: [
    // ...
    {
      provide: CHECKBOX_CONFIG,
      useValue: {
        isInterpreterChecked: false,
        isCaptionerChecked: false,
        isSwitchingcenterChecked: false,
        isCompanyChecked: false,
      } as CheckboxConfig,
    },
  ],
  declarations: [
    ContactListComponent,
    ContactDescriptionComponent,
    AddContactFormComponent,
    CompanyHoursModalComponent,
    // FilterByUserTypePipe,
  ],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    TranslateModule,
    ReactiveFormsModule,
    ContactsRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    // MatDialogModule,
    MatIconModule,
    MatInputModule,
    FuseAlertModule,
    MatLuxonDateModule,
    OverlayModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressBarModule,
    MatChipsModule,
    MatRadioModule,
    MatRippleModule,
    MatStepperModule,
    CdkStepperModule,
    MatSelectModule,
    MatSidenavModule,
    Ng2SearchPipeModule,
    MatTableModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    SharedModule,
    NgxMaterialTimepickerModule,
  ],
})
export class ContactsModule {}
