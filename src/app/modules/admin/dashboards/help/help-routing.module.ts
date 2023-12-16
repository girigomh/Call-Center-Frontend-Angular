import { GuideComponent } from './guides/guide/guide.component';
import { HelpCenterMostAskedFaqsResolver, HelpCenterFaqsResolver, HelpCenterGuidesResolver, HelpCenterGuidesCategoryResolver, HelpCenterGuidesGuideResolver } from './help.resolver';
import { HelpComponent } from './help.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqsComponent } from './faqs/faqs.component';
import { GuidesComponent } from './guides/guides.component';
import { SupportComponent } from './support/support.component';
import { CategoryComponent } from './guides/category/category.component';

const routes: Routes = [
    {
        path: '',
        component: HelpComponent,
        resolve: {
            faqs: HelpCenterMostAskedFaqsResolver
        }
    },
    {
        path: 'faqs',
        component: FaqsComponent,
        resolve: {
            faqs: HelpCenterFaqsResolver
        }
    },
    {
        path: 'guides',
        children: [
            {
                path: '',
                component: GuidesComponent,
                resolve: {
                    guides: HelpCenterGuidesResolver
                }
            },
            {
                path: ':categorySlug',
                children: [
                    {
                        path: '',
                        component: CategoryComponent,
                        resolve: {
                            guides: HelpCenterGuidesCategoryResolver
                        }
                    },
                    {
                        path: ':guideSlug',
                        component: GuideComponent,
                        resolve: {
                            guide: HelpCenterGuidesGuideResolver
                        }
                    }
                ]
            }
        ]
    },
    {
        path: 'support',
        component: SupportComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HelpRoutingModule { }
