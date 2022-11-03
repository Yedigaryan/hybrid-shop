import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoodsInterface } from '@store/interfaces/goods.interface';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  data: GoodsInterface;
  amount: FormControl = new FormControl(null);
  quantity: FormControl = new FormControl(null);
  quantityChange: boolean;
  amountChange: boolean;


  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.product;
      }
    });
  }

  public ngOnInit(): void {
    this.quantity.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(quantity => {
      if (!this.amountChange) {
        this.quantityChange = true;
        this.amount.setValue((quantity * this.data.price).toFixed(2));
        this.quantityChange = false;
      }
    });
    this.amount.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(amount => {
      if (!this.quantityChange) {
        this.amountChange = true;
        this.quantity.setValue(Math.floor(amount / this.data.price).toFixed(0));
        this.amountChange = false;
      }
    });

  }

  public setAmount(amount: number): void {
    this.amount.setValue(amount.toFixed(2));
  }

  public setQuantity(quantity: number): void {
    this.quantity.setValue(quantity);
  }
}
