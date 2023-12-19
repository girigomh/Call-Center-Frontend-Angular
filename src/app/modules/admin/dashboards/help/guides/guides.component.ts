import { HttpClient } from '@angular/common/http';
import { GuideCategory } from './../help.types';
import { Subject, takeUntil, tap } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HelpService } from '../help.service';

@Component({
    selector: 'app-guides',
    templateUrl: './guides.component.html',
    styleUrls: ['./guides.component.scss']
})
export class GuidesComponent implements OnInit, OnDestroy {
    guideCategories: any[];
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
        // Get the Guide categories
        this._helpCenterService.guides$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((guideCategories) => {
                this.guideCategories = guideCategories;
            });
        // const limit = '4';
        // this.http.get<GuideCategory[]>('api/apps/help-center/guides').pipe(
        //     tap((response: any) => {
        //         console.log(response, 'ccccccccccccl');
        //         this.guideCategories = response;
        //     })
        // );
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
