import { ContactListComponent } from "./contact-list/contact-list.component";
import { ContactDescriptionComponent } from "./contact-description/contact-description.component";
import { CanDeactivateContactsDetails } from "./contacts.guard";
import {
  ContactsCountriesResolver,
  ContactsContactResolver,
  ContactsResolver,
} from "./contacts.resolver";
import { CallsComponent } from "../calls/calls.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompanyComponent } from "../company/company.component";
import { AddContactFormComponent } from './add-contact-form/add-contact-form.component';
// import { CallListComponent } from './call-list/call-list.component';

// const routes: Routes = [
//   {
//     path: "contact/:id",
//     component: CallListComponent,
//   },
//   {
//     path: "",
//     component: CallsComponent,
//     resolve: {
//       tags: ContactsTagsResolver,
//     },
//     children: [
//       {
//         path: "",
//         component: CallListComponent,
//         resolve: {
//           contacts: CallsResolver,
//           countries: ContactsCountriesResolver,
//         },
//       },
//       {
//         path: "company",
//         component: CompanyComponent,
//         resolve: {
//           contact: ContactsContactResolver,
//           countries: ContactsCountriesResolver,
//         },
//         canDeactivate: [CanDeactivateContactsDetails],
//       },
//       {
//         path: "company/:id",
//         component: CompanyComponent,
//         resolve: {
//           contact: ContactsContactResolver,
//           countries: ContactsCountriesResolver,
//         },
//         canDeactivate: [CanDeactivateContactsDetails],
//       },
//     ],
//   },
// ];
const routes: Routes = [
  // { path: "contacts/:userId", component: ContactDescriptionComponent },
  {
    path: 'create',
    component: AddContactFormComponent,
    resolve: {
      contacts: ContactsResolver,
      countries: ContactsCountriesResolver,
    },
  },
  {
    path: '',
    component: ContactListComponent,
    resolve: {
      contacts: ContactsResolver,
      countries: ContactsCountriesResolver,
    },
    children: [
      {
        path: ':userId',
        component: ContactDescriptionComponent,
        resolve: {
          contact: ContactsContactResolver,
          countries: ContactsCountriesResolver,
        },
        canDeactivate: [CanDeactivateContactsDetails],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
