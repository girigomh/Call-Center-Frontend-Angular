import { AnalyticsResolver } from './analytics.resolver';
import { AnalyticsComponent } from './analytics.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: AnalyticsComponent,
        resolve: {
            data: AnalyticsResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
