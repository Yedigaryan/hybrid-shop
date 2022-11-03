import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  public async init(): Promise<void> {
    this._storage = await this.storage.create();
  }

  public defineDriver(): Promise<any> {
    return this.storage.defineDriver(CordovaSQLiteDriver);
  }

  public set(key: string, value: any): Promise<any> {
    return this._storage?.set(key, value);
  }

  public get(key: string): Promise<string> {
    return this._storage?.get(key);
  }
}
