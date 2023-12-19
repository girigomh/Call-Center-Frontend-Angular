import { CustomerResolver, InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver } from './customers.resolvers';
import { CustomersComponent } from './customers.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: CustomersComponent,
        resolve: {
            brands: InventoryBrandsResolver,
            categories: InventoryCategoriesResolver,
            products: InventoryProductsResolver,
            tags: InventoryTagsResolver,
            vendors: InventoryVendorsResolver,
            customers: CustomerResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomersRoutingModule { }
