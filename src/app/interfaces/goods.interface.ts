export interface GoodsInterface {
  'sku': number;
  'name': string;
  'type': string;
  'price': number;
  'upc': string;
  'category': Array<Category>;
  'shipping': number;
  'description': string;
  'manufacturer': string;
  'model': string;
  'url': string;
  'image': string;
  'key'?: string;
}

export interface Category {
  'id': string;
  'name': string;
}
