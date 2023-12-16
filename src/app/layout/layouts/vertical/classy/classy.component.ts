import { featchUserRole } from './../../../../mock-api/common/navigation/check';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/shared/dtos/user';

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [
        `.fuse-vertical-navigation-item-disabled {
            display: none;
        }`
    ]
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    // ['ANONYMOUS', 'COMPANYLEADER', 'COMPANYEMPLOYEE', 'SWITCHINGCENTERLEADER', 'SWITCHINGCENTEMPLOYEE', 'CAPTIONER', 'COMMUNICATIONASSISTENCE'].includes(featchUserRole())

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                const condition = JSON.parse(localStorage.getItem('currentUser'));
                console.log(condition.type);
                // navigation.default.filter();
                this.navigation = navigation;
            });

        this.user = JSON.parse(localStorage.getItem('currentUser'));

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
        // this.getWhetherData();
    }

    checkPath(): any {
        return window.location.pathname.includes('notifications');
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
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
    selectImage(event: any): any {
        console.log(event.target.files[0]);
        localStorage.setItem('profile', JSON.stringify(event.target.files[0].name));
    }
    // getRouter(): void{
    //     return true;
    // };
    // getWhetherData(): any {
    //     navigator.geolocation.getCurrentPosition(this.permissionGranted, this.errorCallback);
    //     // this._userService.wheather();
    // };
    permissionGranted(position): any {
        console.log(position);
    };
    errorCallback(error): any {
        console.log(error);
    };

}
