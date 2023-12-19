// import { CallsComponent } from "../calls/calls.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppointmentsComponent } from "../appointments/appointments.component";

const routes: Routes = [
  {
    path: "",
    component: AppointmentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
