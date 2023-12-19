import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { I18nModule } from "app/core/i18n/i18n.module";
import * as $ from 'jquery';
import { Subject } from "rxjs";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = $localize`:@@app.title:Welcome to the Angular i18n demo in english`;
  callSubject; 

  changeLocale(locale: string) {
    // Store the user's preferred locale in localStorage
    localStorage.setItem("locale", locale);

    I18nModule.setLocale();

    // Reload the page to apply the new locale
    location.reload();
  }
  /**
   * Constructor
   */
  constructor(private route: Router) {

  }

  ngOnInit(): void {
    $.getScript('assets/js/videoroomtest.js');
    (window as any).toCallPage = this.toCallPage;
    (window as any).route = this.route;

  }

  toCallPage(){
    let routing = this.route
    this.callSubject = new Subject<any>()
    routing.navigateByUrl('/dashboard/call')
    console.log("checking to call")

    this.callSubject.next("emited")

    this.callSubject.subscribe((test:any) => {
    })
  }

  navigate(){
  }
}
