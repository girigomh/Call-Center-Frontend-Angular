import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import { Router } from "@angular/router";
import * as L from "leaflet";
import {
  GeoSearchControl,
  OpenStreetMapProvider,
  SearchControl,
} from "leaflet-geosearch";
import { CustomDatePipe } from "../contacts/custom-date.pipe";

@Component({
  selector: "app-appointments",
  templateUrl: "./appointments.component.html",
  styleUrls: ["./appointments.component.scss"],
  providers: [CustomDatePipe, DatePipe],
})
export class AppointmentsComponent implements OnInit {
  public appointments: any[];
  storedAppointmentData: any[];
  // teamMembers: any[];
  userAppointmentData: any;
  startTime: string;
  endTime: string;
  // Geocoder: any;
  // @ViewChild(MatStepper) stepper!: MatStepper;
  todayDate: string;
  appointmentForm: FormGroup;
  fullTime: boolean = true;
  address: any;
  selectedOption: string = "online";
  input: string = "";
  myProvider = new OpenStreetMapProvider();
  results: any[] = [];
  map;

  @Output() appointmentDataSubmitted = new EventEmitter<any>();

  async initMap() {
    setTimeout(() => {
      this.map = L.map("map").setView([47.33333333, 13.33333333], 10);
      L.marker([47.333333, 13.333333]).addTo(this.map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
      const searchControl = SearchControl({
        notFoundMessage:
          "Sorry, that address could not be found. Please try by adding manually in map.",
        provider: new OpenStreetMapProvider(),
        style: "bar",
      });

      this.map.addControl(searchControl);
      this.map.on("click", (e) => {
        L.marker([47.333333, 13.333333]).remove();
        // L.marker(e.latlng, { draggable: true }).addTo(this.map);
        // if (this.map.hasLayer(marker)) {
        //   this.map.removeLayer(marker)
        // }
        console.log(e);
      });
    }, 500);
  }

  constructor(
    private _router: Router,
    private datePipe: DatePipe,
    private _fb: FormBuilder,
    private dateAdapter: DateAdapter<any>
  ) {

    this.dateAdapter.getFirstDayOfWeek = () => {return 1}
    this.storedAppointmentData = JSON.parse(
      localStorage.getItem("appointmentData") || "[]"
    );
    this.startTime = "";
    this.endTime = "";
    this.todayDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.appointmentForm = this._fb.group({
      interpreterType: [""],
      endTime: ["", Validators.required],
      startTime: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      address: ["Blk 73 av lane Uk"],
      city: ["Birmingham"],
      country: ["Autria"],
      street: ["Jones street"],
      zip: [""],
      note: ["The new notes are here!"],
      topic: [" Any topic", Validators.required],
      purpose: [" Medical", Validators.required],
      confirmation: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    const storedData = localStorage.getItem("appointmentData");

    if (storedData) {
      this.storedAppointmentData = JSON.parse(storedData);
    } else {
      this.storedAppointmentData = []; // Initialize the array if no data is present
    }
  }

  ngAfterViewInit(): void {
    // this.initMap();
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, "dd/MM/yyyy");
  }

  schedule() {
    console.log(this.appointmentForm.value, this.appointmentForm.valid);
    if (this.appointmentForm.valid) {
      this.userAppointmentData = this.appointmentForm.value;
      this.appointmentDataSubmitted.emit(this.userAppointmentData);
      console.log(this.appointmentForm.value);
      let storedData = JSON.parse(
        localStorage.getItem("appointmentData") || "[]"
      );
      if (!Array.isArray(storedData)) {
        storedData = [];
      }
      storedData.push(this.userAppointmentData);
      localStorage.setItem("appointmentData", JSON.stringify(storedData));

      // Form reset should be done after form submission is complete
      this.appointmentForm.reset();
    }
    console.log(this.userAppointmentData);
  }

  // showAddressOnMap(): void {
  //   // const geocoder = L.Control.Geocoder.nominatim();
  //   // const geocoder = L.Control.geocoder();
  //   // const GeocoderControl = new Geocoder();
  //   geocoders.geocode(this.address, (results) => {
  //     if (results.length > 0) {
  //       const { lat, lon } = results[0].center;
  //       const marker = L.marker([lat, lon]).addTo(this.map);
  //       this.map.setView([lat, lon], 10);
  //     } else {
  //       console.log("No results found for the entered address");
  //     }
  //   });
  // }
  async searchCity() {
    // console.log("call in gcity")
    const { address, city, country, street, zip } = this.appointmentForm.value;
    let searchQuery =
      address + " " + street + " " + city + " " + zip + "" + country;
    searchQuery.toString();
    // city: ["Birmingham"],
    // country: ["Autria"],
    // street: ["Jones street"],
    // zip: [""],
    // this.results = await this.myProvider.search({ query: this.input });
    console.log(await this.myProvider.search({ query: searchQuery }));
  }
  setView(x, y) {
    this.map.setView([x, y], 10);
    L.marker([x, y]).addTo(this.map);
  }
}
