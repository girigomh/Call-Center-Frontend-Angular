import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { I18nModule} from 'app/core/i18n/i18n.module'
import { FuseNavigationItem } from '@fuse/components/navigation';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                this.translateNavigation(navigation);
                this._navigation.next(navigation);
            })
        );
    }

    translateNavigation(navigation: Navigation): void
    {
        this.translateFuseNavigations(navigation.compact);
        this.translateFuseNavigations(navigation.default);
        this.translateFuseNavigations(navigation.futuristic);
        this.translateFuseNavigations(navigation.horizontal);
    }

    translateFuseNavigations(navigations: FuseNavigationItem[]): void
    {
        navigations.forEach(navigation=>navigation.title = I18nModule.translate(navigation.id));
    }
}
