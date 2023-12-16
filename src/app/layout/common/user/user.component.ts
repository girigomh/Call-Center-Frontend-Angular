/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import { BooleanInput } from "@angular/cdk/coercion";
import { Subject, takeUntil } from "rxjs";
import { OnlineStatus } from "app/core/user/user.types";
import { UserService } from "app/core/user/user.service";
import { User } from "app/shared/dtos/user";

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'user',
})
export class UserComponent implements OnInit, OnDestroy {
  // @Input() showAvatar: boolean = true;
  // static ngAcceptInputType_showAvatar: BooleanInput;
  // ONLINE: OnlineStatus.ONLINE;
  // AWAY: OnlineStatus.AWAY;
  // BUSY: OnlineStatus.BUSY;
  // INVISIBLE: OnlineStatus.INVISIBLE;

  // user: User;

  // private _unsubscribeAll: Subject<any> = new Subject<any>();
  onlineStatusEnum = OnlineStatus;
  @Input() showAvatar: boolean = true;
  @Output() updateUserStatusEvent: EventEmitter<string> =
    new EventEmitter<string>();
  static ngAcceptInputType_showAvatar: BooleanInput;
  status: any = localStorage.getItem('status') || OnlineStatus.ONLINE;
  ONLINE: OnlineStatus = OnlineStatus.ONLINE;
  AWAY: OnlineStatus = OnlineStatus.AWAY;
  BUSY: OnlineStatus = OnlineStatus.BUSY;
  INVISIBLE: OnlineStatus = OnlineStatus.INVISIBLE;

  user: User;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _userService: UserService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to user changes
    this.user = JSON.parse(localStorage.getItem('currentUser'));

    console.log(this.ONLINE, this.INVISIBLE, this.AWAY, this.BUSY);
    /*setTimeout(() => {
            if (localStorage.getItem('status')) {
                this.updateUserStatus(localStorage.getItem('status'));
                return;
            }
            this.updateUserStatus('online');
        }, 1500);*/
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
   * Update the user status
   *
   * @param status
   */
  updateUserStatus(onlineStatus: OnlineStatus): void {
    console.log(onlineStatus);
    console.log(this.user, 'hello');
    // this.onlineStatusEnumS = onlineStatus;
    // Return if user is not available
    if (!this.user) {
      return;
    }

    // Set localstorage status
    // !Api is Remaining
    localStorage.setItem('status', onlineStatus);
    this.status = onlineStatus;

    // Update the user
    // this._userService
    //   .update({
    //     ...this.user,
    //     onlineStatus,
    //   })
    //   .subscribe((updatedUser: User) => {
    //     console.log(updatedUser, this.user);
    //     this.user = updatedUser;
    //     // Manually trigger change detection to update the template
    //     this._changeDetectorRef.detectChanges();
    //     // Emit the updated user status to the parent component (contact-description)
    //     this.updateUserStatusEvent.emit(onlineStatus);
    //   });
  }

  /**
   * Sign out
   */
  signOut(): void {
    this._router.navigate(['/sign-out']);
  }
}
