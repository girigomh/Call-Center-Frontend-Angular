import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";

@Component({
  selector: "app-video-call",
  templateUrl: "./video-call.component.html",
  styleUrls: ["./video-call.component.scss"],
})
export class VideoCallComponent implements OnInit {
  userType: string =
    "COMPANY" ||
    "COMPANYEMPLOYEE" ||
    "SWITCHINGCALLCENTEREMPLOYEE" ||
    "CAPTIONER" ||
    "COMMUNICATIONASSISTENCE" ||
    "COMPANYEMPLOYEE" ||
    "INTERPRETER" ||
    "SWITCHINGCALLCENTER" ||
    "COMMUNICATIONASSISTENCE";
  openingHoursOptions: string[] = [
    "Mon: 07:00",
    "Tue: 08:00",
    "Wed: 09:00",
    "Thu: 07:00",
    "Fri: 08:00",
    "Sat: 09:00",
    "Sun: Closed",
    " rund um die Uhr erreichbar sein",
  ];
  videoCallForm: UntypedFormGroup;
  constructor(private _formBuilder: UntypedFormBuilder) {}
  ngOnInit(): void {
    // Create the form
    this.videoCallForm = this._formBuilder.group({
      videoCallSettings: [true],
    });
    window.dispatchEvent(new Event("resize"))
    
  }
}
