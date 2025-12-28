import { createFeatureSelector, createSelector } from '@ngrx/store';
import { productDetailFeatureKey, ProductDetailState } from './product-detail.state';
import { selectProducts } from '../../../shared/products/store/products.selectors';

const featureSelector = createFeatureSelector<ProductDetailState>(
  productDetailFeatureKey
);

export const selectProductDetail = createSelector(
  featureSelector,
  selectProducts,
  (state: ProductDetailState, products) => {
    console.log('In Selector', products);
    return products.find((p) => p.id === state.productId);
  }
);
