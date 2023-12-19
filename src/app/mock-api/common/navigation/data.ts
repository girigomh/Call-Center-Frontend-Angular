/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* tslint:disable:max-line-length */
import { featchUserRole } from "./check";
import { FuseNavigationItem } from "@fuse/components/navigation";

export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "basic",
    icon: "heroicons_outline:cube",
    link: "/dashboard",
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    hidden(item): any {
      if (["ANONYMOUS"].includes(featchUserRole())) {
        return true;
      }
    },
  },
  {
    id: "contacts",
    title: "Kontakte",
    type: "basic",
    icon: "heroicons_outline:user-group",
    link: "/dashboard/contacts",
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    hidden(item): any {
      if (["ANONYMOUS"].includes(featchUserRole())) {
        return true;
      }
    },
  },
  {
    id: "calendar",
    title: "Kalender",
    type: "basic",
    icon: "heroicons_outline:calendar",
    link: "/dashboard/calendar", // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    hidden(item): any {
      // eslint-disable-next-line max-len
      if (
        [
          "anonymos",
          "company_leader",
          "company_employee",
          "switching_center_leader",
          "switching_center_employee",
          "captioner",
          "communication_assistance",
          "customer",
        ].includes(featchUserRole())
      ) {
        return true;
      }
    },
  },
  {
    id: "call",
    title: "Anrufe",
    type: "basic",
    icon: "heroicons_outline:phone",
    link: "/dashboard/call", // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    hidden(item): any {
      if (["company_leader", "company_employee"].includes(featchUserRole())) {
        return true;
      }
    },
  },
  {
    id: "files",
    title: "Dateien",
    type: "basic",
    icon: "heroicons_outline:folder",
    link: "/dashboard/files",
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    // hidden(item): any {
    //   if (
    //     ["ANONYMOUS", "COMPANYLEADER", "COMPANYEMPLOYEE"].includes(
    //       featchUserRole()
    //     )
    //   ) {
    //     return true;
    //   }
    // },
    hidden(item): any {
      const userRole = featchUserRole();
      return !["admin"].includes(userRole);
    },
  },
  {
    id: "customers",
    title: "Klienten",
    type: "basic",
    icon: "perm_contact_calendar",
    link: "/dashboard/customers",
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    hidden(item): any {
      if (["anonymos", "customer"].includes(featchUserRole())) {
        return true;
      }
    },
  },
  {
    id: "invoice",
    title: "Rechnungen",
    type: "basic",
    icon: "heroicons_outline:calculator",
    link: "/dashboard/invoice",
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    // hidden(item): any {
    //   if (
    //     [
    //       "ANONYMOUS",
    //       "COMPANYEMPLOYEE",
    //       "CUSTOMER",
    //       "SWITCHINGCENTEMPLOYEE",
    //       "CAPTIONER",
    //       "COMMUNICATIONASSISTENCE",
    //     ].includes(featchUserRole())
    //   ) {
    //     return true;
    //   }
    // },
    hidden(item): any {
      const userRole = featchUserRole();
      return !["admin"].includes(userRole);
    },
  },
  {
    id: "notifications",
    title: "Benachrichtigungen",
    type: "basic",
    icon: "heroicons_outline:bell",
    link: "/dashboard/notifications",
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    // hidden(item): any {
    //   if (["ANONYMOUS"].includes(featchUserRole())) {
    //     return true;
    //   }
    // },
    hidden(item): any {
      const userRole = featchUserRole();
      return !["admin"].includes(userRole);
    },
  },
  {
    id: "promotional-video",
    title: "Werbevideo",
    type: "basic",
    icon: "heroicons_outline:play",
    link: "/dashboard/videos",
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    // hidden(item): any {
    //   if (
    //     ["ANONYMOUS", "COMPANYEMPLOYEE", "CUSTOMER"].includes(featchUserRole())
    //   ) {
    //     return true;
    //   }
    // },
    hidden(item): any {
      const userRole = featchUserRole();
      return !["admin"].includes(userRole);
    },
  },
  {
    id: "user",
    title: "Benutzer",
    type: "basic",
    icon: "heroicons_outline:user",
    link: "/dashboard/user",
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    hidden(item): any {
      if (["anonymos"].includes(featchUserRole())) {
        return true;
      }
    },
  },
  {
    id: "company",
    title: "Firma",
    type: "basic",
    icon: "heroicons_outline:office-building",
    link: "/dashboard/company",
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    hidden(item): any {
      if (
        [
          "anonymos",
          "interpreter",
          "customer",
          "communication_assistance",
          "customer",
          "company_employee",
          "switching_center_employee",
        ].includes(featchUserRole())
      ) {
        return true;
      }
    },
  },
  {
    id: "settings",
    title: "Einstellungen",
    type: "basic",
    icon: "heroicons_outline:cog",
    link: "/dashboard/settings",
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    hidden(item): any {
      if (["anonymos"].includes(featchUserRole())) {
        return true;
      }
    },
  },
  {
    id: "help",
    title: "Hilfe",
    type: "basic",
    icon: "help_outline",
    link: "/dashboard/help",
  },
  {
    id: "logout",
    title: "Ausloggen",
    type: "basic",
    icon: "heroicons_outline:logout",
    link: "/sign-out",
  },
];
export const compactNavigation: FuseNavigationItem[] = [
  {
    id: "example",
    title: "Dashboard",
    type: "basic",
    icon: "heroicons_outline:chart-pie",
    link: "/example",
  },
];
export const futuristicNavigation: FuseNavigationItem[] = [
  {
    id: "example",
    title: "Pagal",
    type: "basic",
    icon: "heroicons_outline:chart-pie",
    link: "/example",
  },
];
export const horizontalNavigation: FuseNavigationItem[] = [
  {
    id: "example",
    title: "Catoo",
    type: "basic",
    icon: "heroicons_outline:chart-pie",
    link: "/example",
  },
];
