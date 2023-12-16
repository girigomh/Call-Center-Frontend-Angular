import { FinanceComponent } from "./../finance/finance.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AnalyticsComponent } from "./../analytics/analytics.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { NgApexchartsModule } from "ng-apexcharts";
import { SharedModule } from "app/shared/shared.module";
import { ProjectComponent } from "app/modules/admin/dashboards/project/project.component";
import { projectRoutes } from "app/modules/admin/dashboards/project/project.routing";
import { MatChipsModule } from "@angular/material/chips";
import { MatListModule } from "@angular/material/list";
import { FilesComponent } from "../files/files.component";
import { CallsComponent } from "../calls/calls.component";
import { ContactsComponent } from "../contacts/contacts.component";
import { EmailsComponent } from "../emails/emails.component";
import { AppointmentsComponent } from "../appointments/appointments.component";
import { TimeSheetsComponent } from "../time-sheets/time-sheets.component";
import { ClientsComponent } from "../clients/clients.component";
import { EmployeesComponent } from "../employees/employees.component";
import { CalendarComponent } from "../calendar/calendar.component";
import { adapterFactory } from "angular-calendar/date-adapters/moment";
import * as moment from "moment";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { CalendarDateFormatter, CalendarModule, CalendarMomentDateFormatter, DateAdapter } from "angular-calendar";
import { PromotionalVideosComponent } from "../promotional-videos/promotional-videos.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { I18nModule } from "app/core/i18n/i18n.module";
import { ErrorComponent } from "../error/error.component";
import { AppointmentStepperComponent } from "./stepper/appointment-stepper/appointment-stepper.component";
import { MatStepperModule } from "@angular/material/stepper";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckbox, MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { GoogleMapsModule } from "@angular/google-maps";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LuxonDateAdapter } from "@angular/material-luxon-adapter";
import { CustomDateAdapter } from "app/shared/adapters/date.adapter";
import { CustomDatePipe } from "../contacts/custom-date.pipe";
// import { AgmCoreModule } from "@agm/core";

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

@NgModule({
  declarations: [
    ProjectComponent,
    FilesComponent,
    CallsComponent,
    ErrorComponent,
    ContactsComponent,
    EmailsComponent,
    AppointmentsComponent,
    TimeSheetsComponent,
    ClientsComponent,
    EmployeesComponent,
    CalendarComponent,
    PromotionalVideosComponent,
    AnalyticsComponent,
    FinanceComponent,
    CustomDatePipe,
    AppointmentStepperComponent,
  ],
  imports: [
    MatStepperModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    NgxMaterialTimepickerModule,
    MatRadioModule,
    RouterModule.forChild(projectRoutes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: momentAdapterFactory,
    }),
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRippleModule,
    MatExpansionModule,
    CdkAccordionModule,
    MatSidenavModule,
    MatSortModule,
    MatTooltipModule,
    MatTableModule,
    LeafletModule,
    MatTabsModule,
    NgApexchartsModule,
    // TranslocoModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    SharedModule,
    MatChipsModule,
    MatListModule,
    MatCheckboxModule,
    MatDialogModule,
    GoogleMapsModule
  ],
  // providers: [I18nModule.setLocale(), I18nModule.setLocaleId(),],
})
export class ProjectModule {}
