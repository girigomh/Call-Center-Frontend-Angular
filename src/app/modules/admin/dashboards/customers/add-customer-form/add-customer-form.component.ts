/* eslint-disable @typescript-eslint/member-ordering */
import { UserService } from './../../../../../core/user/user.service';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Placeholders } from 'app/core/placeholder.types';
import { AddMemberFormComponent } from 'app/layout/common/settings/team/team.component';
import { featchUserRole } from 'app/mock-api/common/navigation/check';
import * as countrycitystatejson from 'countrycitystatejson';
import country from '../../../../../modules/utils/country-stateData.json';
import { I18nModule } from 'app/core/i18n/i18n.module';
import { DateAdapter } from '@angular/material/core';


@Component({
    selector: 'app-add-customer-form',
    templateUrl: './add-customer-form.component.html',
    styleUrls: ['./add-customer-form.component.scss']
})
export class AddCustomerFormComponent implements OnInit {
    customerForm: UntypedFormGroup;
    today: any = new Date();
    countryValue: any;
    allCountries = countrycitystatejson;
    placeholder: Placeholders;
    countries = this.allCountries.getCountries();
    states: any;
    isEmployee: boolean = ['COMPANYEMPLOYEE'].includes(featchUserRole());
    types: any[];
    constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddMemberFormComponent>, private dateAdapter: DateAdapter<any>,
        private _userService: UserService,
        @Inject(MAT_DIALOG_DATA) public data: any,) {
            this.dateAdapter.getFirstDayOfWeek = () => {return 1}
        this.customerForm = this._formBuilder.group(
            {
                firstName: ['', [Validators.required]],
                lastName: ['', [Validators.required]],
                birthday: ['', [Validators.required]],
                pdfs: [''],
                emails: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(8)]],
                profilePhoto: [''],
                // city: ['', Validators.required],
                street: ['', [Validators.required]],
                houseNo: ['', [Validators.required]],
                state: ['', [Validators.required]],
                zip: ['', [Validators.required]],
                gender: ['', [Validators.required]],
                location: ['', [Validators.required]],
                country: ['', [Validators.required]],
                phoneNo: ['', [Validators.required]],
            });
        this.countryValue = country.Countries;
    }

    ngOnInit(): void {
        console.log(this.countryValue, country);
        this._userService.getUserTypes()
            .subscribe((types: any[]) => {
                // Load the contacts

                this.types = types.filter((type: any) => this.checkUserTypes(type.name) && type);
                console.log(this.types);
                // this.types.forEach((type) => {
                //     type.label = I18nModule.translate(type.name);
                //     console.log(type.label);
                // });


                console.log(this.types.length);
            });
        this.placeholder = new Placeholders();
    }

    getCountryName(name: any): any {
        const stateNames = this.countryValue.filter((i: any) => {
            if (i.CountryName === name) {
                return i.States;
            }
        });
        this.states = stateNames[0].States;
    }
    checkUserTypes(userType: any): any {
        if (['ADMIN', 'USER', 'TRANSLATOR', 'CAPTIONER', 'COMMUNICATIONASSISTENCE', 'ANONYMOUS'].includes(userType)) {
            return false;
        } else {
            return true;
        }
    }
}
