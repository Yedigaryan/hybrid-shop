import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsComponent } from './components/goods/goods.component';
import { ProductComponent } from '@store/modules/goods/components/product/product.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsComponent
  },
  {
    path: ':id',
    component: ProductComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class GoodsRoutingModule {
}
