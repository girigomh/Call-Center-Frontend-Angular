import { CommonModule, registerLocaleData } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ExtraOptions, PreloadAllModules, RouterModule } from "@angular/router";
import { MarkdownModule } from "ngx-markdown";
import { FuseModule } from "@fuse";
import { FuseConfigModule } from "@fuse/services/config";
import { FuseMockApiModule } from "@fuse/lib/mock-api";
import { CoreModule } from "app/core/core.module";
import { appConfig } from "app/core/config/app.config";
import { mockApiServices } from "app/mock-api";
import { LayoutModule } from "app/layout/layout.module";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { AppComponent } from "app/app.component";
import { appRoutes } from "app/app.routing";
import { InvoiceComponent } from "./modules/admin/dashboards/invoice/invoice.component";
import "@angular/localize/init";
import { I18nModule } from "app/core/i18n/i18n.module";
import { TranslateModule } from "@ngx-translate/core";

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: "enabled",
};
import { MatExpansionModule } from "@angular/material/expansion";
import { AnonymousLoginComponent } from "./modules/auth/anonymous-login/anonymous-login.component";
import { ProfileDataService } from "./shared/profile-photo.service";
import { NotFoundComponent } from './modules/admin/dashboards/not-found/not-found.component';
import { DateAdapter, MOMENT } from "angular-calendar";
import { CustomDateAdapter } from "./shared/adapters/date.adapter";
// import { ErrorComponent } from './modules/admin/dashboards/error/error.component';
// import { LanguageComponent } from './settings/language/language.component';
import localeDe from '@angular/common/locales/de';
import moment from "moment";
registerLocaleData(localeDe);
@NgModule({
  declarations: [
    AppComponent,
    InvoiceComponent,
    AnonymousLoginComponent,
    NotFoundComponent,
    // ErrorComponent,
    // LanguageComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, routerConfig),

    // Fuse, FuseConfig & FuseMockAPI
    FuseModule,
    FuseConfigModule.forRoot(appConfig),
    FuseMockApiModule.forRoot(mockApiServices),

    // Core module of your application
    CoreModule,
    MatIconModule,
    MatInputModule,
    CdkAccordionModule,
    MatExpansionModule,
    TranslateModule.forRoot(),
    MatFormFieldModule,
    MatExpansionModule,
    ReactiveFormsModule,
    // Layout module of your application
    LayoutModule,
    MatFormFieldModule,
    // 3rd party modules that require global configuration via forRoot
    MarkdownModule.forRoot({}),
  ],
  providers: [
    ProfileDataService,
    // I18nModule.setLocale(),
    // I18nModule.setLocaleId(),
    {
      provide: MOMENT,
      useValue: moment,
    },
    { provide: DateAdapter, useClass: CustomDateAdapter }],
  bootstrap: [AppComponent],
})
export class AppModule {}
