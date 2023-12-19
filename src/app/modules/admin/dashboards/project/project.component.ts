/* eslint-disable max-len */
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FinanceService } from "app/modules/admin/dashboards/finance/finance.service";
import { featchUserRole } from "./../../../../mock-api/common/navigation/check";
/* eslint-disable @typescript-eslint/member-ordering */

import { ElementRef, EventEmitter, Output } from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { FormBuilder, Validators } from "@angular/forms";
// import { Router } from "@angular/router";
import { MatStepper } from "@angular/material/stepper";
// import { MatDialogRef } from "@angular/material/dialog";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApexOptions } from "ng-apexcharts";
import { ProjectService } from "app/modules/admin/dashboards/project/project.service";
import { AuthService } from "app/core/auth/auth.service";
import { UserService } from "app/core/user/user.service";
import { User } from "app/shared/dtos/user";
import { I18nModule } from "app/core/i18n/i18n.module";
import { TeamMemberService } from "app/shared/team-member-service.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AppointmentStepperComponent } from "./stepper/appointment-stepper/appointment-stepper.component";
import { DatePipe } from "@angular/common";
import { UserType } from "app/shared/dtos/user_type";
import { ProfileDataService } from "app/shared/profile-photo.service";
import { WeatherService } from "app/shared/weather.service";
import { ContactService } from "../contacts/contacts.service";

@Component({
  selector: "project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .calls-margin {
        margin-top: 96px;
      }
    `,
  ],
})
export class ProjectComponent implements OnInit, OnDestroy {
  @ViewChild("appointmentFormSection") appointmentFormSection!: ElementRef;
  storedAppointmentData: any[];
  teamMembers: any[];
  weatherData: any;
  userAppointmentData: any;
  isAdminOrSwitchingCallcenter: boolean = false;
  private unsubscribe$: Subject<void> = new Subject<void>();
  @ViewChild("recentTransactionsTable", { read: MatSort })
  recentTransactionsTableMatSort: MatSort;
  chartGithubIssues: ApexOptions = {};
  chartTaskDistribution: ApexOptions = {};
  chartBudgetDistribution: ApexOptions = {};
  selectedTab: string = "home";
  days: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  chartWeeklyExpenses: ApexOptions = {};
  chartMonthlyExpenses: ApexOptions = {};
  chartYearlyExpenses: ApexOptions = {};
  // currentUser: any = {}; // Initialize with an empty object
  userData: any;
  data: any;
  date = new Date();

  selectedProject: string = "ACME Corp. Backend App";
  show: boolean;
  showFinance: boolean;
  showAnalytics: boolean;
  showTeams: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  public files: any[] = [];
  public appointments: any[];
  public emails: any[];
  public employees: any[];
  public sheets: any[];
  public clients: any[];
  public foods: any[];
  public currentUser?: any;

  public role?: any;
  weatherType:string;
  name = "";
  greeting = I18nModule.translate("dashboard.welcome");
  recentTransactionsDataSource: MatTableDataSource<any> =
    new MatTableDataSource();
  recentTransactionsTableColumns: string[] = [
    "transactionId",
    "date",
    "name",
    "amount",
    "status",
  ];
  contacts = [
    {
      id: "cd5fa417-b667-482d-b208-798d9da3213c",
      avatar: "assets/images/avatars/male-01.jpg",
      background: "assets/images/cards/14-640x480.jpg",
      name: "Dejesus Michael",
      emails: [
        {
          email: "dejesusmichael@mail.org",
          label: "Personal",
        },
        {
          email: "michael.dejesus@vitricomp.io",
          label: "Work",
        },
      ],
      phoneNumbers: [
        {
          country: "bs",
          phoneNumber: "984 531 2468",
          label: "Mobile",
        },
        {
          country: "bs",
          phoneNumber: "806 470 2693",
          label: "Work",
        },
      ],
      title: "Schriftdolmetscher",
      company: "Vitricomp",
      birthday: "1975-01-10T12:00:00.000Z",
      address: "279 Independence Avenue, Calvary, Guam, PO4127",
      // eslint-disable-next-line max-len
      notes:
        "<p>Do incididunt cillum duis eu pariatur enim proident minim officia amet proident consequat consequat qui consequat magna magna occaecat aliquip culpa pariatur velit nisi nostrud irure eu ullamco exercitation sint.</p><p>Cillum deserunt laborum laborum quis nisi enim et aliquip labore excepteur in excepteur labore amet in ipsum ipsum nostrud deserunt lorem nisi voluptate dolor minim enim ut eu cupidatat enim.</p>",
      tags: ["56ddbd47-4078-4ddd-8448-73c5e88d5f59"],
    },
    {
      id: "beec5287-ed50-4504-858a-5dc3f8ce6935",
      avatar: null,
      background: null,
      name: "Dena Molina",
      emails: [
        {
          email: "denamolina@mail.us",
          label: "Personal",
        },
        {
          email: "molina.dena@envire.tv",
          label: "Work",
        },
      ],
      phoneNumbers: [
        {
          country: "io",
          phoneNumber: "934 537 3180",
          label: "Mobile",
        },
      ],
      title: "Dolmetscherin",
      company: "Envire",
      birthday: "1994-12-05T12:00:00.000Z",
      address: "856 Woodside Avenue, Alfarata, Iowa, PO4992",
      // eslint-disable-next-line max-len
      notes:
        "<p>Consequat duis ullamco sint elit pariatur esse dolore nostrud consequat lorem duis sunt veniam ipsum exercitation eiusmod consequat nisi quis voluptate quis officia irure fugiat ex duis eu amet ex.</p><p>Irure est nisi dolor culpa sunt nulla irure lorem adipisicing non do consequat deserunt et ea eu non reprehenderit fugiat ex elit nulla sunt quis voluptate enim nulla aliquip veniam.</p>",
      tags: ["56ddbd47-4078-4ddd-8448-73c5e88d5f59"],
    },
  ];

  @Output() appointmentDataSubmitted = new EventEmitter<any>();

  /**
   * Constructor
   */
  constructor(
    private _projectService: ProjectService,
    private teamMemberService: TeamMemberService,
    private _authService: AuthService,
    private _userService: UserService,
    private _financeService: FinanceService,
    private _router: Router,
    private datePipe: DatePipe,
    private _fb: FormBuilder,
    private weatherService: WeatherService,
    private profileDataService: ProfileDataService,
    private _contactsService: ContactService,
    private dialog: MatDialog // public dialog: MatDialogRef<ProjectComponent>
  ) {
    this.storedAppointmentData = JSON.parse(
      localStorage.getItem("appointmentData") || "[]"
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // label: I18nModule.translate(""),
    // this.weatherService.getWeatherData().subscribe(
    //   (data) => {
    //     this.weatherData = data; // Assign fetched weather data to the variable
    //   },

    //   (error) => {
    //     console.error("Error fetching weather data:", error);
    //   }
    // );
    this.getGeoLocation();
    
    // this._contactsService.contacts$.subscribe((contacts)=>{
    //   console.log(contacts,"fromc")
    // })
    this._contactsService.getContacts().subscribe((contacts) => {
      localStorage.setItem('contacts', JSON.stringify(contacts))
    })
    this.userData = this.profileDataService.getUserData();
    console.log(this.userData);
    const storedData = localStorage.getItem("appointmentData");

    if (storedData) {
      this.storedAppointmentData = JSON.parse(storedData);
    } else {
      this.storedAppointmentData = []; // Initialize the array if no data is present
    }
    // Subscribe to the teamMembersSubject to receive updates
    this.teamMemberService
      .intialize()

      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((teamMembers) => {
        console.log(teamMembers);
        this.teamMembers = teamMembers;
      });
    // this.teamMembers = this.teamMemberService.getTeamMembers();
    const uData = JSON.parse(localStorage.getItem("currentUser"));
    this.name = uData.firstName;
    this._financeService.getData().subscribe((data) => {
      this.recentTransactionsDataSource.data = data.recentTransactions;
    });
    const hours = this.date.getHours();
    if (hours >= 4 && hours <= 11) {
      this.greeting = I18nModule.translate("dashboard.good-morning");
    } else if (hours >= 11 && hours <= 17) {
      this.greeting = I18nModule.translate("dashboard.good-day");
    } else if (hours >= 17 && hours <= 21) {
      this.greeting = I18nModule.translate("dashboard.good-evening");
    } else if ((hours >= 21 && hours <= 24) || (hours >= 0 && hours <= 4)) {
      this.greeting = I18nModule.translate("dashboard.good-night");
    }
    this.currentUser = this._authService.getCurrentUser();
    this._userService.getUserById(this.currentUser).subscribe((response) => {
      localStorage.setItem("user", JSON.stringify(response));
      localStorage.setItem("status", response.onlineStatus);
      console.log(response);
      let u: User = new User(
        response.userId,
        response.username,
        response.firstName,
        response.lastName,
        response.userType,
        response.street,
        response.location,
        response.city,
        response.state,
        response.country,
        response.zip,
        response.houseNo,
        response.phoneNo,
        response.userSince,
        response.lastLogin,
        response.onlineStatus,
        response.birthday,
        response.profilePhoto,
        response.pdfs,
        response.counter
      );
      this._userService._user.next(u);
      this.role = response.role;
      this.files = response.files;
      this.appointments = response.appointments;
      this.clients = response.clients;
      this.emails = response.emails;
      this.employees = response.employees;
      this.sheets = response.sheets;
    });
    const role = featchUserRole();
    this.show = !["ANONYMOUS"].includes(role);
    this.showFinance = [
      "SWITCHINGCALLCENTERLEADER",
      "SWITCHINGCALLCENTEREMPLOYEE",
      "CAPTIONER",
      "COMMUNICATIONASSISTENCE",
      "ADMIN",
    ].includes(role);
    this.showAnalytics = [
      "CAPTIONER",
      "COMMUNICATIONASSISTENCE",
      "SWITCHINGCALLCENTERLEADER",
      "SWITCHINGCALLCENTEREMPLOYEE",
      "COMPANYLEADER",
      "ADMIN",
    ].includes(role);
    this.showTeams = [
      "SWITCHINGCALLCENTERLEADER",
      "SWITCHINGCALLCENTEREMPLOYEE",
      "COMPANYLEADER",
      "ADMIN",
      "COMPANYLEADER",
      "INTERPRETER",
      "CAPTIONER",
      "COMMUNICATIONASSISTENCE",
    ].includes(role);
    this._projectService.data$.subscribe((data) => {
      this.data = data;
    });
    window.dispatchEvent(new Event("resize"));
  }

  // ngAfterViewInit(): void {
  //   this.initMap();
  // }

  // Function to format the date
  formatDate(date: Date): string {
    return this.datePipe.transform(date, "dd/MM/yyyy");
  }

  handleAppointmentDataSubmitted(appointmentData: any) {
    this.storedAppointmentData.push(appointmentData);
    localStorage.setItem(
      "appointmentData",
      JSON.stringify(this.storedAppointmentData)
    );
    console.log(appointmentData);
  }

  // isRaining() {
  //   if (this.weatherData?.hourly?.precipitation?.[this.date.getHours()] > 0) {
  //     return true; // It's raining
  //   }
  //   return false; // It's not raining
  // }
  isRaining() {
    return this.weatherData?.hourly?.precipitation?.[this.date.getHours()] > 0;
  }

  getGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        console.log(pos.coords.latitude);
        console.log(pos.coords.longitude);
        const storedWeatherData = sessionStorage.getItem("weatherData");
        if (storedWeatherData) {
          this.weatherData = JSON.parse(storedWeatherData);
          console.log(this.weatherData);
          const weatherMapping = {
            0: "clearSky",
            1: "sunny",
            2: "partlyCloudy",
            3: "cloudy",
            10: "rain",
            11: "rain",
            12: "heavyRain",
            40: "lightSnow",
            41: "snow",
            42: "heavySnow"
          };
          console.log(this.getWeatherType())
          this.weatherType = this.getWeatherType()
          window.dispatchEvent(new Event("resize"));
        } else {
          // Fetch weather data when the component initializes
          this.weatherService
            .getWeatherData(pos.coords.latitude, pos.coords.longitude)
            .subscribe((data) => {
              this.weatherService.getLocationDetails(pos.coords.latitude, pos.coords.longitude).subscribe((resposne)=> {
                data = {...data, location: resposne}
                console.log(data)
                this.weatherData = data; // Store the data in a component property
                // Store data in localStorage
                console.log(this.getWeatherType(),"where are you ??")
                this.weatherType = this.getWeatherType()

                sessionStorage.setItem("weatherData", JSON.stringify(data));
              })
            });
          console.log(this.data);
          window.dispatchEvent(new Event("resize"));
        }
      });
    }
  }

  getWeatherType(){
    const weatherMapping = {
      0: "clearSky",
      1: "sunny",
      2: "partlyCloudy",
      3: "cloudy",
      10: "rain",
      11: "rain",
      12: "heavyRain",
      40: "lightSnow",
      41: "snow",
      42: "heavySnow"
    };
    // let type  = weatherMapping[this.weatherData.current_weather.wheatercode]
    // if(this.weatherData.current_weather.wheatercode > 0 && this.weatherData.current_weather.wheatercode < 4){
    //   return "cloudy"
    // } else if(this.weatherData.current_weather.wheatercode > 10 && this.weatherData.current_weather.wheatercode < 13){
    //   return "rainy"
    // } else if(this.weatherData.current_weather.wheatercode > 40 && this.weatherData.current_weather.wheatercode < 43) {
    //   return "snowy"
    // } else if(this.weatherData.current_weather.wheatercode > 50 && this.weatherData.current_weather.wheatercode < 53){
    //   return "showers"
    // } else {
    //   return "unknown"
    // }
    console.log(this.weatherData.current_weather.weathercode)
    return weatherMapping[this.weatherData.current_weather.weathercode]
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    // Unsubscribe from the teamMembersSubject
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
