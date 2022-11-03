import { Component, OnInit, ViewChild } from '@angular/core';
import { GoodsInterface } from '@store/interfaces/goods.interface';
import { FirebaseCrudService } from '@store/services/firebase-crud.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { StorageService } from '@store/services/storage.service';
import { delay, take } from 'rxjs/operators';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.scss'],
})
export class GoodsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  goods: GoodsInterface[] = [];
  goodsOriginal: GoodsInterface[] = [];
  searchBar: FormControl = new FormControl('');
  query: string;


  constructor(
    public readonly firebaseCrudService: FirebaseCrudService,
    private readonly router: Router,
    private readonly storage: StorageService,
  ) {
    this.searchBar.reset();
  }

  public async ngOnInit(): Promise<void> {
    await this.storage.defineDriver();
    await this.storage.init();
    /* In the comments I describe second way by getting the whole list but with bigger data there will be freezing*/
    // combineLatest(
    //   this.firebase.getGoodsList().snapshotChanges().pipe(
    //     map((changes: SnapshotAction<GoodsInterface>[]) =>
    //       changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
    //     )
    //   ),
    //   this.firebase.searchQuery,
    //   (goods, search) => ({goods, search})).subscribe(data => {
    //   if (data.search) {
    //     this.goods = data.goods.filter(c => (c.name.toLowerCase().includes(data.search.toLowerCase())));
    //   } else {
    //     this.goods = data.goods;
    //   }
    // });
    this.loadGoods();
    this.firebaseCrudService.loading.subscribe((loading: boolean) => {
      if (!loading) {
        this.storage?.get('query')?.then((query: string) => {
          this.query = query;
          if (this.query) {
            this.searchBar.setValue(this.query);
            this.filterGoods(query);
          }
        });
      }
    });

    this.searchBar.valueChanges.subscribe((changes: string) => {
      this.filterGoods(changes);
      this.saveToStorage(changes);
    });
  }

  public filterGoods(filter): void {
    if (filter.length === 0) {
      this.loadGoods();
    } else {
      this.goods = this.goodsOriginal.filter(c => (c.name.toLowerCase().includes(filter.toLowerCase())));
    }
  }

  public loadGoods(): void {
    this.firebaseCrudService.loadGoodsList().pipe(take(1)).subscribe((data: GoodsInterface[]) => {
      this.goods = data;
      this.goodsOriginal = this.goods;
      this.firebaseCrudService.loading.next(false);
    });
  }

  public navigate(result: GoodsInterface): void {
    this.router.navigate(['/', result.upc], {state: {product: result}});
  }

  public loadData() {
    setInterval(() => {
      this.firebaseCrudService.loadGoods();
      this.infiniteScroll.complete();
    }, Math.floor(Math.random() * 5000 + 3000));
  }

  public handleRefresh($event): void {
    this.goods = [];
    this.firebaseCrudService.resetGoodsData();
    this.loadGoods();
    setTimeout(() => {
      $event.target.complete();
    }, 1000);
  }

  private async saveToStorage(phrase: string): Promise<any> {
    await this.storage.set('query', phrase);
  }
}

