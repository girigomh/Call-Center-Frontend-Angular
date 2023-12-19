import { featchUserRole } from "./../../../mock-api/common/navigation/check";
import { MatDrawer } from "@angular/material/sidenav";
import { FuseMediaWatcherService } from "./../../../../@fuse/services/media-watcher/media-watcher.service";
import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { FuseConfigService } from "@fuse/services/config";
import { AppConfig, Scheme, Theme, Themes } from "app/core/config/app.config";
import { Layout } from "app/layout/layout.types";
import { I18nModule } from "app/core/i18n/i18n.module";

@Component({
  selector: "settings",
  templateUrl: "./settings.component.html",
  styles: [
    `
      settings {
        position: static;
        display: block;
        flex: none;
        width: auto;
      }

      @media (screen and min-width: 1280px) {
        empty-layout + settings .settings-cog {
          right: 0 !important;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit, OnDestroy {
  @ViewChild("drawer") drawer: MatDrawer;
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  panels: any[] = [];
  selectedPanel: string = "account";
  showBilling: boolean = [
    "CUSTOMER",
    "COMPANYEMPLOYEE",
    "INTERPRETER",
    "CAPTIONER",
    "COMMUNICATIONASSISTENCE",
  ].includes(featchUserRole());
  showTeam: boolean = [
    "CUSTOMER",
    "INTERPRETER",
    "CAPTIONER",
    "COMMUNICATIONASSISTENCE",
  ].includes(featchUserRole());
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Setup available panels
    this.panels = [
      {
        id: "account",
        icon: "heroicons_outline:user-circle",
        title: "Konto",
        description:
          "Verwalte ein öffentliches Profil und deine privaten Informationen",
      },
      {
        id: "security",
        icon: "heroicons_outline:lock-closed",
        title: "Sicherheit",
        description:
          "Verwalte dein Passwort und die Einstellungen für die Bestätigung in zwei Schritten",
      },
      {
        id: "plan-billing",
        icon: "heroicons_outline:credit-card",
        title: "Planen & Abrechnung",
        description:
          "Verwalte deinen Abonnementplan, deine Zahlungsmethode und deine Rechnungsinformationen",
      },
      {
        id: "notifications",
        icon: "heroicons_outline:bell",
        title: "Benachrichtigungen",
        description:
          "Verwalte, wann du auf welchen Kanälen benachrichtigt wirst",
      },
      {
        id: "team",
        icon: "heroicons_outline:user-group",
        title: "Team",
        description:
          "Verwalte dein bestehendes Team und ändere Rollen/Berechtigungen",
      },
      // {
      //   id: "language",
      //   icon: "heroicons_outline:user",
      //   title: "Language",
      //   description:
      //     "Verwalte dein bestehendes Team und ändere Rollen/Berechtigungen",
      // },
      {
        id: "Videotelefonie",
        icon: "heroicons_outline:video-camera",
        title: "Videotelefonie",
        description:
          "Verwalte dein bestehendes Team und ändere Rollen/Berechtigungen",
      },
    ];
    if (this.showTeam) {
      this.panels = this.panels.filter(
        (panel: any) =>
          panel.title !== "Team" && panel.title !== "Planen & Abrechnung"
      );
      console.log("first", this.panels);
    } else if (this.showBilling) {
      this.panels = this.panels.filter(
        (panel: any) => panel.title !== "Planen & Abrechnung"
      );
      console.log("first2", this.panels);
    }
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Set the drawerMode and drawerOpened
        if (matchingAliases.includes("lg")) {
          this.drawerMode = "side";
          this.drawerOpened = true;
        } else {
          this.drawerMode = "over";
          this.drawerOpened = false;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
      window.dispatchEvent(new Event("resize"))
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
   * Navigate to the panel
   *
   * @param panel
   */
  goToPanel(panel: string): void {
    this.selectedPanel = panel;

    // Close the drawer on 'over' mode
    if (this.drawerMode === "over") {
      this.drawer.close();
    }
  }

  /**
   * Get the details of the panel
   *
   * @param id
   */
  getPanelInfo(id: string): any {
    return this.panels.find((panel) => panel.id === id);
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
