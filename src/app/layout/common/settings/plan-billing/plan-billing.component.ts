import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'settings-plan-billing',
    templateUrl: './plan-billing.component.html',
    styleUrls: ['./plan-billing.component.scss']
})
export class PlanBillingComponent implements OnInit {
    planBillingForm: UntypedFormGroup;
    plans: any[];
    // cif stands for creditor identification number
    paymentDetails: any = {
        cif: 'DE98ZZZ09999999999',
        bName: 'Video Call Center',
        bAdress: 'Abc, Efgb, Austria'
    };
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.planBillingForm = this._formBuilder.group({
            plan: ['Enterprise'],
            name: ['', Validators.required],
            address: ['', Validators.required],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            IBAN_No: ['', Validators.required],
            bankIdentifierCode: ['', Validators.required],
            signature: ['', Validators.required],
        });

        // Setup the plans
        this.plans = [
            {
                value: 'enterprise',
                label: 'ENTERPRISE',
                details: 'Nach Minuten berechnet für alle Users, pro Minute wird 5 Cent verrechnet',
                price: '0',
                type: 'monat'
            },
            {
                value: 'enterprise-fix-monthly',
                label: 'ENTERPRISE-fix-monatlich',
                details: 'Unbegrenzte Minuten und Fixer Preis monatliche Abrechnung pro User.',
                price: '24.90',
                type: 'monat'
            },
            {
                value: 'enterprise-fix-annual',
                label: 'ENTERPRISE-fix-jährlich',
                details: 'Ungebrenzte Minuten und Fixer Preis jährliche Abrechnung pro User.',
                price: '249.00',
                type: 'jahr'
            },
            {
                value: 'enterprise-fix-monthly',
                label: 'ENTERPRISE-PRO-fix-monatlich',
                details: 'Unbegrenzte Minuten und Fixer Preis jährliche Abrechnung pro User (mindestens 10 User).',
                price: '19.90',
                type: 'monat'
            },
            {
                value: 'enterprise-fix-annual',
                label: 'ENTERPRISE-PRO-fix-jährlich',
                details: 'Unbegrenzte Minuten und Fixer Preis jährliche Abrechnung pro User (mindestens 10 User.',
                price: '199.00',
                type: 'jahr'
            }
        ];
      window.dispatchEvent(new Event("resize"))

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    handleSubmit(): any {
        const data = {
            ...this.paymentDetails,
            ...this.planBillingForm.value
        };
        console.log(data, this.planBillingForm);
    }
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
