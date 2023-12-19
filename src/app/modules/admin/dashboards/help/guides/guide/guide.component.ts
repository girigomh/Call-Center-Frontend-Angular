import { GuideCategory } from './../../help.types';
import { takeUntil, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HelpService } from '../../help.service';

@Component({
    selector: 'app-guide',
    templateUrl: './guide.component.html',
    styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit, OnDestroy {
    guideCategory: GuideCategory;
    private _unsubscribeAll: Subject<any> = new Subject();

    /**
     * Constructor
     */
    constructor(private _helpCenterService: HelpService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the Guides
        this._helpCenterService.guide$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((guideCategory) => {
                this.guideCategory = guideCategory;
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
