import { GuideCategory } from './../../help.types';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HelpService } from '../../help.service';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

    guideCategory: GuideCategory;
    private _unsubscribeAll: Subject<any> = new Subject();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _helpCenterService: HelpService,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the Guides
        this._helpCenterService.guides$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((guideCategories) => {
                this.guideCategory = guideCategories[0];
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
