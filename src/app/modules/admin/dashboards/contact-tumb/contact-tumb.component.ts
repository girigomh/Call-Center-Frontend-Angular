import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { Contact } from 'app/layout/common/quick-chat/quick-chat.types';

@Component({
    selector: 'app-contacttumb',
    templateUrl: './contact-tumb.component.html',
    styleUrls: ['./contact-tumb.component.scss']
})
export class ContactTumbComponent implements OnInit {
    @Input() item: Contact;
    constructor(private Routes: ActivatedRoute) { }

    ngOnInit(): void {
    }

}
