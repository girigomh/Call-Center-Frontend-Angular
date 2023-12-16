import { trigger, state, style, animate, transition } from '@angular/animations';
/* eslint-disable max-len */
/* eslint-disable quotes */
import { AddCustomerFormComponent } from './add-customer-form/add-customer-form.component';
import { MatDialog } from '@angular/material/dialog';
import { featchUserRole } from './../../../../mock-api/common/navigation/check';
import { CustomersService } from './customers.service';

import { Subject, Observable, takeUntil, debounceTime, map, merge, switchMap } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { InventoryProduct, InventoryBrand, InventoryCategory, InventoryTag, InventoryPagination, InventoryVendor } from './customers.types';
import { MatSort } from '@angular/material/sort';
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { I18nModule } from 'app/core/i18n/i18n.module';
@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }
            }
        `
    ],
    styleUrls: ['./customers.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class CustomersComponent implements OnInit, OnDestroy {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    products$: Observable<InventoryProduct[]>;
    showAdd: boolean = ['SWITCHINGCENTERLEADER', 'ADMIN'].includes(featchUserRole());
    searchPlaceHolder: string = 'Search customers';
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    customers$: Observable<any>;
    isCertified: boolean = false;
    displayedColumns: string[] = ['firstName', 'lastName', 'birthday'];
    dataSource: any;
    totalElements: number;
    pageSize: number;
    columnsToDisplay = [{
        icon: 'user-circle',
        name: 'firstName'
    },
    {
        icon: 'user-circle',
        name: 'lastName'
    },
    {
        icon: 'badge-check',
        name: 'verification'
    },
    {
        icon: 'cake',
        name: 'birthday'
    },
    {
        icon: 'cash',
        name: 'financeStatus'
    },
    {
        icon: 'location-marker',
        name: 'state'
    },
    {
        icon: 'key',
        name: 'status'
    }
    ];
    columnsToDisplayWithExpand = [...this.columnsToDisplay.map(i => i.name), 'expand'];
    expandedElement: CustomerModal | null;
    dialogRef: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _customerService: CustomersService,
        private _dialog: MatDialog,
        private _translate: TranslateService
    ) {
        _translate.setDefaultLang('en');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.getCustomers();
        this.searchPlaceHolder = I18nModule.translate('customers.search');
        console.log(this.searchPlaceHolder);
    }
    /**o
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }


    /**
     * Create product
     */
    createCustomer(): void {
        const token = localStorage.getItem('currentToken');
        this.dialogRef = this._dialog.open(AddCustomerFormComponent);
        this.dialogRef.afterClosed().subscribe((result) => {
            if (result === undefined) {
                return;
            }
            const payload = {
                ...result,
                userId: null,
                // eslint-disable-next-line max-len
                birthday: [new Date(result.birthday).getFullYear(), new Date(result.birthday).getMonth() + 1, new Date(result.birthday).getDate(), new Date(result.birthday).getHours(), new Date(result.birthday).getMinutes(), new Date(result.birthday).getSeconds()],
                onlineStatus: true,
                pdfs: ['abc.pdf'],
                counter: new Date().getHours() + `:` + new Date().getMinutes() + `:` + new Date().getSeconds(),
                userSince: [2018, 5, 25, 14, 22, 56],
                lastLogin: [2018, 5, 25, 14, 22, 56],
                loginAttempts: null,
                appointments: null,
                sheets: null,
                userType: 'CUSTOMER',
                username: result.emails,
                token: token,
                tokenExpiration: null,
                emailConfirmed: false,
                creditPrivate: 12.339999999999999857891452847979962825775146484375,
                creditWorking: 12.339999999999999857891452847979962825775146484375,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                sms_certification: true
            };
            console.log(JSON.stringify(payload));
            this._customerService.addBusinessObject(payload).subscribe(data => this.getCustomers());

        });
    }

    getCustomers(): any {
        this._customerService.getCustomers().subscribe((data) => {
            console.log(data);
            data.content.sort((a, b) => {
                if (a.firstName < b.firstName) {
                    return -1;
                }
                if (a.firstName > b.firstName) {
                    return 1;
                }
                return 0;
            });
            this.dataSource = data.content;
            this.totalElements = data.totalElements;
            this.pageSize = data.size;
        });
    }
    handlePageEvent(e: PageEvent): any {
        this._customerService.getCustomers(e.pageIndex).subscribe((data) => {
            this.dataSource = data.content;
        });
    }
    formatDate(arr: any): any {
        const dateString = new Date(`${arr[0]}/${arr[1]}/${arr[2]}`);
        return dateString.toLocaleDateString();
    }

    translateTableHeader(header: string): string {
        header = I18nModule.translate(`customers.${header}`);
        return header;
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
export interface CustomerModal {
    username: string;
    userType: string;
    userId: number;
    firstName: string;
    lastName: string;
    birthday: any[];
    street: string;
    location: string;
    country: string;
    houseNo: string;
    phoneNo: string;
    pdfs: any[];
    profilePhoto?: string;
    onlineStatus: boolean;
    counter: string;
    userSince: any[];
    lastLogin: any[];
    captcha: any;
    creditPrivate: number;
    creditWorking: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    sms_certification: boolean;
    zip: any;
}
