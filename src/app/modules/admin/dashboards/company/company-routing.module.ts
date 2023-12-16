import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompanyComponent } from "./company.component";
import { CallsComponent } from "../calls/calls.component";

const routes: Routes = [
  {
    path: "",
    component: CompanyComponent,
  },
  {
    path: ':companyname',
    component: CompanyComponent
  },
  // {
  //   path: "company/:companyId",
  //   component: CompanyComponent,
  //   // canActivate: [CompanyGuard], // optional guard to handle undefined companyId
  // },
  { path: "Call", component: CallsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
