import { FaqCategory } from './../help.types';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-faqs',
    templateUrl: './faqs.component.html',
    styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit, OnDestroy {

    faqCategories: FaqCategory[];
    private _unsubscribeAll: Subject<any> = new Subject();

    /**
     * Constructor
     */
    constructor(private http: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the FAQs
        // this._helpCenterService.faqs$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((faqCategories) => {
        //         this.faqCategories = faqCategories;
        //     });
        this.http.get<FaqCategory[]>('api/apps/help-center/faqs').subscribe((faqCategories) => {
            this.faqCategories = faqCategories;
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
