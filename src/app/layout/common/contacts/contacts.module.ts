import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContactsComponent } from 'app/layout/common/contacts/contacts.component';
import { SharedModule } from 'app/shared/shared.module';
import { ContactTumbComponent } from 'app/modules/admin/dashboards/contact-tumb/contact-tumb.component';

@NgModule({
    declarations: [
        ContactsComponent,
        ContactTumbComponent
    ],
    imports     : [
        RouterModule,
        OverlayModule,
        PortalModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        SharedModule
    ],
    exports     : [
        ContactsComponent,
    ]
})
export class ContactsModule
{
}
