import { HttpClient } from '@angular/common/http';
import { FaqCategory } from './help.types';
import { HelpService } from './help.service';
import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

    faqCategory: FaqCategory;
    private _unsubscribeAll: Subject<any> = new Subject();

    /**
     * Constructor
     */
    constructor(private _helpCenterService: HelpService, private http: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // // Get the FAQs
        // this._helpCenterService?.faqs$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((faqCategories) => {
        //         this.faqCategory = faqCategories[0];
        //     });
        this.http.get('api/apps/help-center/faqs').subscribe((data) => {
            // console.log(data);
            this.faqCategory = data[0];
        });
    }

    // /**
    //  * On destroy
    //  */
    // ngOnDestroy(): void {
    //     // Unsubscribe from all subscriptions
    //     this._unsubscribeAll.next(null);
    //     this._unsubscribeAll.complete();
    // }

    // // -----------------------------------------------------------------------------------------------------
    // // @ Public methods
    // // -----------------------------------------------------------------------------------------------------

    // /**
    //  * Track by function for ngFor loops
    //  *
    //  * @param index
    //  * @param item
    //  */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

}
