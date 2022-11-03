import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoodsRoutingModule } from './goods-routing.module';
import { GoodsComponent } from '@store/modules/goods/components/goods/goods.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from '@store/modules/goods/components/product/product.component';


@NgModule({
  declarations: [
    GoodsComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    GoodsRoutingModule,
    IonicModule,
    ReactiveFormsModule,
  ]
})
export class GoodsModule {
}
