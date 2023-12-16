import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { User } from 'app/shared/dtos/user';
import * as $ from 'jquery';
import { closestOnSegment } from 'ol/coordinate';

// declare let $: any;

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.css'],
})
export class CallsComponent implements OnInit, OnDestroy {
  // translatedText = this.translation.getMessage("start a call");
  isMuted: boolean = false;
  @ViewChild('myElem') MyProp: ElementRef;
  isUnPublished: boolean = false;
  queryParamsSubscription: any;
  username: string = '';
  messages: any = [];
  peer: string = '';
  dialogRef: any;
  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}
  ngOnInit(): void {
    const userData: User = JSON.parse(localStorage.getItem('currentUser'));
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        if (params.username) {
          this.peer = params.username.split(' ')[0];
        }
      }
    );
    this.messages = JSON.parse(sessionStorage.getItem('peerChat'));
    console.log('PeerChat:==============', this.messages);
    // $.getScript('assets/js/videoroomtest.js');
    $.getScript('assets/js/videocallFunctions.js');
    this.username = userData.firstName
      ? userData.firstName.split(' ')[0]
      : 'Admin';
    console.log('username:==========', this.username);
  }
  openDialog(content) {
    this.dialogRef = this.dialog.open(content);

    this.dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }
}
