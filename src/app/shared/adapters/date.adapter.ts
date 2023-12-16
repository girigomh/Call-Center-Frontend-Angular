import { MatDateFormats, NativeDateAdapter } from "@angular/material/core";

/** Adapts the native JS Date for use with cdk-based components that work with dates. */
// export class CustomDateAdapter extends NativeDateAdapter {

//     override getFirstDayOfWeek(): number {
//         return 2;
//     }
export class CustomDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 1;
  }
}

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: "DD/MM/YY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

// export { CUSTOM_DATE_FORMATS };
