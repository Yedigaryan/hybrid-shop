import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { GoodsInterface } from '@store/interfaces/goods.interface';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirebaseCrudService {
  /* In the comments I describe second way by getting the whole list but with bigger data there will be freezing*/
  public goodsRef: AngularFireList<GoodsInterface>;
  public loading: Subject<boolean> = new Subject<boolean>();
  private goodsList: Array<GoodsInterface> = [];
  private lastKey = '';
  private dbPath = '/goods-list';


  constructor(private db: AngularFireDatabase) {
    this.goodsRef = this.db.list(this.dbPath);
  }

  // public createGoods(goods: GoodsInterface): any {
  //   return this.goodsRef.push(goods);
  // }

  public loadGoods(): void {
    firebase.database().ref(this.dbPath)
      .limitToFirst(20)
      .orderByKey()
      .once('value', snap => {
        if (snap.numChildren() === 1) {
          console.log('snap.numChildren() === 1');
        } else {
          snap.forEach(child => {
            if (this.lastKey !== child.key) {
              this.lastKey = child.key;
              this.goodsList.push(child.val());
            }
          });
        }
      });
  }

  // public getGoodsList(): AngularFireList<GoodsInterface> {
  //   return this.goodsRef;
  // }

  public resetGoodsData(): void {
    this.goodsList = [];
  }

  public loadGoodsList(): Observable<GoodsInterface[]> {
    this.loading.next(true);
    this.loadGoods();
    return of(this.goodsList).pipe(delay(Math.floor(Math.random() * 5000 + 3000)));
  }
}
