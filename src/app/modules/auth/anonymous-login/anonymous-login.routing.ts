import { Route } from "@angular/router";
import { UserGuard } from "app/core/user/user.guard";
import { CallsComponent } from "app/modules/admin/dashboards/calls/calls.component";
import { CompanyComponent } from "app/modules/admin/dashboards/company/company.component";
import { AnonymousLoginComponent } from "app/modules/auth/anonymous-login/anonymous-login.component";

export const AnonymousLoginRoutes: Route[] = [
  {
    path: "",
    component: AnonymousLoginComponent,
  },
  {
    path: "call",
    component: CallsComponent,
  },
  {
    path: "company",
    component: CompanyComponent,
    // loadChildren: () =>
    // import("../../../modules/admin/dashboards/company/company.module").then((m) => m.CompanyModule),
    // canActivate: [UserGuard],
  },
];
