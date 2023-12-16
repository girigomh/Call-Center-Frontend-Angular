import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatStepper } from "@angular/material/stepper";
import { MatDialogRef } from "@angular/material/dialog";
import {
  Map,
  Control,
  DomUtil,
  ZoomAnimEvent,
  Layer,
  MapOptions,
  tileLayer,
  latLng,
} from "leaflet";
import * as L from "leaflet";

@Component({
  selector: "app-appointment-stepper",
  templateUrl: "./appointment-stepper.component.html",
  styleUrls: ["./appointment-stepper.component.scss"],
  providers: [DatePipe],
})
export class AppointmentStepperComponent {
  startTime: string;
  endTime: string;
  @ViewChild(MatStepper) stepper!: MatStepper;
  todayDate: string;
  appointmentForm: any;
  fullTime: boolean = true;
  userAppointmentData: any;
  @Output() appointmentDataSubmitted = new EventEmitter<any>();

  private map;

  private initMap(): void {
    this.map = L.map("map", {
      center: [0, 0],
      zoom: 1,
    });
    const tiles = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 18,
        minZoom: 1,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  }

  // stepper: MatStepper;

  constructor(
    private dialogRef: MatDialogRef<AppointmentStepperComponent>,
    private datePipe: DatePipe,
    private _fb: FormBuilder,
    private _router: Router // private stepper: MatStepper
  ) {
    this.startTime = "";
    this.endTime = "";
    this.todayDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.appointmentForm = this._fb.group({
      interpreterType: [""],
      endTime: ["", Validators.required],
      startTime: ["", Validators.required],
      date: ["", Validators.required],
      location: [null, Validators.required],
      address: ["Blk 73 av lane Uk", Validators.required],
      city: ["Birmingham", Validators.required],
      note: ["The new notes are here!", Validators.required],
      topic: [" Any topic", Validators.required],
      purpose: [" Medical", Validators.required],
      confirmation: [false, Validators.requiredTrue],
    });
  }
  ngOnInIt() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  // Function to format the date
  formatDate(date: Date): string {
    return this.datePipe.transform(date, "dd/MM/yyyy");
  }

  schedule() {
    if (this.appointmentForm.valid) {
      this.userAppointmentData = this.appointmentForm.value;
      this.appointmentDataSubmitted.emit(this.userAppointmentData);
      console.log(this.appointmentForm.value);
      this.appointmentForm.reset();
      this.stepper.reset();
      this.stepper.selectedIndex = 0;

      localStorage.setItem(
        "appointmentData",
        JSON.stringify(this.userAppointmentData)
      );
      // Close the dialog
      this.dialogRef.close();
    } else {
      console.log("invalid form");
    }
  }

  navigateToNextStep() {
    const interpreterTypeControl = this.appointmentForm.get("interpreterType");
    const selectedValue = interpreterTypeControl.value;

    if (selectedValue === "DolmetscherIn") {
      this.stepper.selectedIndex = 4;
    } else if (selectedValue === "SchriftdolmetscherIn") {
      this.stepper.selectedIndex = 1;
    } else {
      // return; // Do nothing if no checkbox is selected
    }

    this.stepper.next(); // Navigate to the selected step
  }
}
