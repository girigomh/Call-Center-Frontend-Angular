import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { th } from "date-fns/locale";

@Component({
  selector: "app-company-hours-modal",
  templateUrl: "./company-hours-modal.component.html",
  styleUrls: ["./company-hours-modal.component.scss"],

  providers: [DatePipe],
})
export class CompanyHoursModalComponent implements OnInit {
  companyHoursForm: FormGroup;
  multipleFormControls: any[] = [
    {
      openingHours: "",
      closingHours: "",
      lunchBreakOpeningHours: "",
      lunchBreakClosingHours: "",
      closed: false,
    },
    {
      openingHours: "",
      closingHours: "",
      lunchBreakOpeningHours: "",
      lunchBreakClosingHours: "",
      closed: false,
    },
    {
      openingHours: "",
      closingHours: "",
      lunchBreakOpeningHours: "",
      lunchBreakClosingHours: "",
      closed: false,
    },
    {
      openingHours: "",
      closingHours: "",
      lunchBreakOpeningHours: "",
      lunchBreakClosingHours: "",
      closed: false,
    },
    {
      openingHours: "",
      closingHours: "",
      lunchBreakOpeningHours: "",
      lunchBreakClosingHours: "",
      closed: false,
    },
    {
      openingHours: "",
      closingHours: "",
      lunchBreakOpeningHours: "",
      lunchBreakClosingHours: "",
      closed: false,
    },
    {
      openingHours: "",
      closingHours: "",
      lunchBreakOpeningHours: "",
      lunchBreakClosingHours: "",
      closed: false,
    },
  ];
  currentDayIndex = 0;
  showError: string = "";
  errorMessageForTime: any;
  dayWiseTimeData: any[] = [];
  days: any[] = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CompanyHoursModalComponent>
  ) {}

  ngOnInit(): void {
    this.companyHoursForm = this.fb.group({
      openingHours: ["", [Validators.required]],
      closingHours: ["", [Validators.required]],
      lunchBreakOpeningHours: ["", [Validators.required]],
      lunchBreakClosingHours: ["", [Validators.required]],
      SundayValue: ["", [Validators.required]],
    });
  }

  AddHours() {
    // this.dialogRef.close({ data: this.companyHoursForm.value });
    this.showError = "";
    for (let i = 0; i < this.multipleFormControls.length; i++) {
      const ele = this.multipleFormControls[i];
      let obj = Object.values(ele);
      if (!ele.closed && obj.includes("")) {
        this.showError = `Please fill all the fields of the ${this.days[i]}`;
        break;
      }
    }
    if (!this.showError.length) {
      let companyHours = [];
      this.multipleFormControls.map((data: any, i: number) => {
        companyHours.push({ ...data, dayofWeek: this.days[i].toUpperCase() });
      });
      this.dialogRef.close({ data: companyHours });
    }

    // const formattedSchedule = this.dayWiseTimeData.map((day) => {
    //   const formattedDay = day.day.substring(0, 3); // Extract first three letters of the day

    //   if (formattedDay === 'Sun') {
    //     if (day.SundayValue === null || day.SundayValue === '') {
    //       return 'Sun: Closed';
    //     }
    //   }

    //   const openingTimeParts = day.openingHours.split(':');
    //   const closingTimeParts = day.closingHours.split(':');

    //   const openingHours = parseInt(openingTimeParts[0], 10);
    //   const openingMinutes = parseInt(openingTimeParts[1], 10);

    //   const closingHours = parseInt(closingTimeParts[0], 10);
    //   const closingMinutes = parseInt(closingTimeParts[1], 10);

    //   const timeDiffHours = closingHours - openingHours;
    //   const timeDiffMinutes = closingMinutes - openingMinutes;

    //   let timeDiffFormatted = '';
    //   if (timeDiffHours > 0) {
    //     timeDiffFormatted = `${timeDiffHours}:${timeDiffMinutes
    //       .toString()
    //       .padStart(2, '0')}`;
    //   } else if (timeDiffHours === 0) {
    //     timeDiffFormatted = `${timeDiffMinutes} minutes`;
    //   }

    //   return `${formattedDay}: ${timeDiffFormatted}`;
    // });

    // console.log('formattedSchedule', formattedSchedule);
  }

  nextDay(day: any) {
    if (this.currentDayIndex < this.days.length - 1) {
      this.currentDayIndex++;
    }
    let value = Object.assign({ day: day }, this.companyHoursForm.value);
    this.dayWiseTimeData.push(value);
    this.companyHoursForm.reset();
  }

  prevDay(i: any) {
    if (this.currentDayIndex > 0) {
      this.currentDayIndex--;
    }
    let value = this.dayWiseTimeData.splice(i, 1);
    this.companyHoursForm.patchValue(value[0]);
  }

  selectTime(type: any) {
    const openingTime = this.companyHoursForm.value.openingHours;
    const lunchBreakOpeningTime =
      this.companyHoursForm.value.lunchBreakOpeningHours;
    const lunchBreakClosingTime =
      this.companyHoursForm.value.lunchBreakClosingHours;
    const closingTime = this.companyHoursForm.value.closingHours;
    if (type == "openTime") {
      this.errorMessageForTime = "";
    } else if (openingTime > lunchBreakOpeningTime) {
      this.errorMessageForTime =
        "Lunch Break Start Time should be greater than Opening Time";
    } else if (lunchBreakOpeningTime > lunchBreakClosingTime) {
      this.errorMessageForTime =
        "Lunch Break End Time should be greater than Lunch Break Start Time";
    } else if (lunchBreakClosingTime > closingTime) {
      this.errorMessageForTime =
        "Closing Time should be greater than Lunch Break End Time";
    } else {
      this.errorMessageForTime = "";
    }
  }
  toggleClosed(i: any) {
    if (this.multipleFormControls[i].closed) {
      this.multipleFormControls[i].openingHours = "";
      this.multipleFormControls[i].closingHours = "";
      this.multipleFormControls[i].lunchBreakOpeningHours = "";
      this.multipleFormControls[i].lunchBreakClosingHours = "";
    }
  }
}
