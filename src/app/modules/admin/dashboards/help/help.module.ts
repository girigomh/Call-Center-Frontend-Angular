import { MatInputModule } from '@angular/material/input';
import { CategoryComponent } from './guides/category/category.component';
import { GuideComponent } from './guides/guide/guide.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SupportComponent } from './support/support.component';
import { GuidesComponent } from './guides/guides.component';
import { FaqsComponent } from './faqs/faqs.component';
import { HelpComponent } from './help.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpRoutingModule } from './help-routing.module';


@NgModule({
    declarations: [
        HelpComponent,
        FaqsComponent,
        GuidesComponent,
        SupportComponent,
        GuideComponent,
        CategoryComponent
    ],
    imports: [
        CommonModule,
        HelpRoutingModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        CdkAccordionModule,
        MatExpansionModule
    ]
})
export class HelpModule { }
