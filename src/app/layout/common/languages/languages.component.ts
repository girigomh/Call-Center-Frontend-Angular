import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { I18nModule } from 'app/core/i18n/i18n.module';
import {AvailableLangs, LangDefinition} from './lang.types';

@Component({
    selector       : 'languages',
    templateUrl    : './languages.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'languages'
})
export class LanguagesComponent implements OnInit, OnDestroy
{
    availableLangs: LangDefinition[];
    activeLang: string;
    

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService
    )
    {
        this.availableLangs = AvailableLangs;
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        console.log(this.availableLangs);
        this.activeLang = localStorage.getItem('country');
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------



    setActiveLang(locale: LangDefinition){
        console.log(JSON.stringify(locale))
        // Store the user's preferred locale in localStorage
        localStorage.setItem('locale', locale.id);
        localStorage.setItem('country', locale.country);
        this.activeLang = locale.country;

        I18nModule.setLocale();

        // Reload the page to apply the new locale
        window.location.href = '/';
    }
}
