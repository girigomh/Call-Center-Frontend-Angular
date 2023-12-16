import { NativeDateAdapter, MatDateFormats } from "@angular/material/core";

class CustomDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 1; // 1 = Monday
  }
}

const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: "L",
  },
  display: {
    dateInput: "L",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
