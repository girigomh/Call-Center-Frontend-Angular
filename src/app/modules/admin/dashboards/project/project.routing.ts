import { UserGuard } from "./../../../../core/user/user.guard";
import { ContactsComponent } from "../contacts/contacts.component";
import { ContactDescriptionComponent } from "app/modules/admin/dashboards/contacts/contact-description/contact-description.component";
import { CallsComponent } from "../calls/calls.component";
import { HelpComponent } from "./../help/help.component";
import { CustomersComponent } from "./../customers/customers.component";
import { InvoiceComponent } from "./../invoice/invoice.component";
import { Route } from "@angular/router";
import { NotificationsComponent } from "app/layout/common/notifications/notifications.component";
import { SettingsComponent } from "app/layout/common/settings/settings.component";
import { UserComponent } from "app/layout/common/user/user.component";
import { ProjectComponent } from "app/modules/admin/dashboards/project/project.component";
import { ProjectResolver } from "app/modules/admin/dashboards/project/project.resolvers";
import { AppointmentsComponent } from "../appointments/appointments.component";
import { CalendarComponent } from "../calendar/calendar.component";
import { ClientsComponent } from "../clients/clients.component";
import { EmailsComponent } from "../emails/emails.component";
import { EmployeesComponent } from "../employees/employees.component";
import { FilesComponent } from "../files/files.component";
import { PromotionalVideosComponent } from "../promotional-videos/promotional-videos.component";
import { TimeSheetsComponent } from "../time-sheets/time-sheets.component";
import {
  ContactsResolver,
  ContactsContactResolver,
} from "app/modules/admin/dashboards/contacts/contacts.resolver";
import { ErrorComponent } from "../error/error.component";
import { Path } from "leaflet";
import { NotFoundComponent } from "../not-found/not-found.component";
import { AuthSignInComponent } from "app/modules/auth/sign-in/sign-in.component";
import { AdminGuard } from "app/core/user/admin.guard";

export const projectRoutes: Route[] = [
  {
    path: "",
    component: ProjectComponent,
    resolve: {
      data: ProjectResolver,
    },
    canActivate: [UserGuard],
  },
  {
    path: "user",
    loadChildren: () =>
      import("../../../profile/profile.module").then((m) => m.ProfileModule),
    canActivate: [UserGuard],
  },
  {
    path: "contacts",
    loadChildren: () =>
      import("../contacts/contacts.module").then((m) => m.ContactsModule),
    canActivate: [UserGuard],
  },
  {
    path: "files",
    loadChildren: () =>
      import("../files/file-manager/file-manager.module").then(
        (m) => m.FileManagerModule
      ),
    canActivate: [AdminGuard],
    // canActivate: [UserGuard],
  },
  {
    path: "emails",
    component: EmailsComponent,
    canActivate: [UserGuard],
  },

  // {
  //   path: "company",
  //   canActivate: [UserGuard],
  //   data: {
  //     roles: ["COMPANYLEADER"], // Specify the role(s) that can access the Company page
  //   },
  //   children: [
  //     {
  //       path: "error",
  //       component: ErrorComponent,
  //     },
  //   ],
  // },

  {
    path: "company",
    loadChildren: () =>
      import("../company/company.module").then((m) => m.CompanyModule),
    // data: {
    //   roles: ['COMPANYLEADER', 'ADMIN', 'COMPANY'], // Specify the role(s) that can access the Company page
    //   path: 'company',
    //   loadChildren: () =>
    //     import('../company/company.module').then((m) => m.CompanyModule),
    // },
  },
  {
    path: "help",
    loadChildren: () => import("../help/help.module").then((m) => m.HelpModule),
  },
  {
    path: "customers",
    loadChildren: () =>
      import("../customers/customers.module").then((m) => m.CustomersModule),
    canActivate: [UserGuard],
  },
  {
    path: "notifications",
    component: NotificationsComponent,
    canActivate: [AdminGuard],
    // canActivate: [UserGuard],
  },
  {
    path: "invoice",
    component: InvoiceComponent,
    canActivate: [AdminGuard],
    // canActivate: [UserGuard],
  },
  {
    path: "calendar",
    component: CalendarComponent,
    canActivate: [UserGuard],
  },
  {
    path: "videos",
    component: PromotionalVideosComponent,
    canActivate: [AdminGuard],
    // canActivate: [UserGuard],
  },
  {
    path: "appointments",
    component: AppointmentsComponent,
    canActivate: [UserGuard],
  },
  {
    path: "time-sheets",
    component: TimeSheetsComponent,
    canActivate: [UserGuard],
  },
  {
    path: "clients-list",
    component: ClientsComponent,
    canActivate: [UserGuard],
  },
  {
    path: "employees",
    component: EmployeesComponent,
    canActivate: [UserGuard],
  },
  {
    path: "error",
    component: ErrorComponent,
    canActivate: [UserGuard],
  },
  {
    path: "settings",
    component: SettingsComponent,
    canActivate: [UserGuard],
  },
  {
    path: "call",
    component: CallsComponent,
  },
  { path: "sign-in", component: AuthSignInComponent },
];
