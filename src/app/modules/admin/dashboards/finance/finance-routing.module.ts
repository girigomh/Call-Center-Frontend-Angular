import { FinanceComponent } from './finance.component';
import { FinanceResolver } from './finance.resolvers';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: FinanceComponent,
        resolve: {
            data: FinanceResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FinanceRoutingModule { }
