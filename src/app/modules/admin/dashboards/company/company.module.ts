import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CompanyRoutingModule } from "./company-routing.module";
import { CompanyComponent } from "./company.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import {
  FuseFindByKeyPipe,
  FuseFindByKeyPipeModule,
} from "@fuse/pipes/find-by-key";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { SharedModule } from "app/shared/shared.module";
import { I18nModule } from "app/core/i18n/i18n.module";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { HttpClientModule } from "@angular/common/http";
// import { FilterByUserTypePipe } from "./filter-usertype.pipe";

@NgModule({
  declarations: [CompanyComponent],
  imports: [
    CommonModule,
    SharedModule,
    CompanyRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    MatFormFieldModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    MatPaginatorModule,
    MatSnackBarModule,
    RouterModule.forChild([{ path: "", component: CompanyComponent }]),
    MatTableModule,
  ],
  providers: [I18nModule.setLocale(), I18nModule.setLocaleId()],
  // providers: [ActivatedRoute],
})
export class CompanyModule {}
