import { Route, RouterModule, Routes } from "@angular/router";
import { NotificationComponent } from "../settings/notification/notification.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: "notifications",
    component: NotificationComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {}
