import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "settings-notifications",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"],
})
export class NotificationComponent implements OnInit {
  notificationsForm: UntypedFormGroup;
  // Assuming you have a property userType in your component
  userType: string = "CUSTOMER";
  notificationEnabled: any;
  userEmail: string;

  /**
   * Constructor
   */
  constructor(private _formBuilder: UntypedFormBuilder) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.notificationsForm = this._formBuilder.group({
      communication: [false],
      security: [false],
      profileVisibality: [true],
      meetups: [false],
      comments: [false],
      mention: [true],
      follow: [true],
      inquiry: [false],
      payment: [true],
      contact: [true],
    });
    window.dispatchEvent(new Event("resize"))

  }

  sendNotificationEmail(emailAddress: string, notificationMessage: string) {
    // Here, we can use our email service - SMTP server to send an email
    // The below logic would be replaced with the actual email sending logic
    const emailData = {
      to: emailAddress,
      subject: "Notification",
      text: notificationMessage,
    };
    console.log("Simulating email sending:", emailData);
    // This will be replaced with the actual email service's method to send an email
    // emailService.sendEmail(emailData);
  }

  toggleNotification(option: string) {
    if (option === "videoCall") {
      console.log("Toggle video call notification");
    } else if (option === "logIn") {
      console.log("Toggle login notification");
    } else if (option === "appointment") {
      console.log("Toggle appointment notification");
    }
  }

  // toggleNotification() {
  //   if (this.notificationEnabled) {
  //     this.sendNotificationEmail(
  //       this.userEmail,
  //       "You have enabled notifications."
  //     );
  //   }
  //   console.log(this.sendNotificationEmail);
  // }
}
