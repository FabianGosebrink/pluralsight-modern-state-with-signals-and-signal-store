import { Product } from '../models/product.models';

export const productsFeatureKey = 'products';

export type ProductsState = {
  products: Product[];
};

export const initialProductsState: ProductsState = {
  products: []
};
