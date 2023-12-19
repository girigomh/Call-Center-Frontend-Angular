import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";

@Component({
  selector: "app-language",
  templateUrl: "./language.component.html",
  styleUrls: ["./language.component.scss"],
})
export class LanguageComponent implements OnInit {
  languageForm: UntypedFormGroup;
  // _formBuilder: any;

  constructor(private _formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    // Create the form
    this.languageForm = this._formBuilder.group({
      languageSettings: [true],
    });

    window.dispatchEvent(new Event("resize"))

  }
}
