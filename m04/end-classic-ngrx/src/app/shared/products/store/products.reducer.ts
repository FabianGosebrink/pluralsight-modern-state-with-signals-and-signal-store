import { createReducer, on } from '@ngrx/store';
import { ProductsApiActions } from './products.actions';
import { initialProductsState } from './products.state';

export const productsReducer = createReducer(
  initialProductsState,

  on(ProductsApiActions.loadProductsSuccess, ProductsApiActions.addProductsFromCheckout, (state, { products }) => ({
    ...state,
    products
  })),

  on(ProductsApiActions.addProductFromDetails, ProductsApiActions.addProductFromDetails, (state, { product }) => ({
    ...state,
    products: [product]
  }))
);
