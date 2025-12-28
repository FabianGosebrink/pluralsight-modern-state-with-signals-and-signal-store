import { createFeatureSelector, createSelector } from '@ngrx/store';
import { checkoutFeatureKey, CheckoutState } from './checkout.state';
import { selectProducts } from '../../products/store/products.selectors';
import { Product } from '../../products/models/product.models';

const featureSelector =
  createFeatureSelector<CheckoutState>(checkoutFeatureKey);

export const selectCartProductIds = createSelector(
  featureSelector,
  (state) => state.cartProductsIds
);

export const selectCartProducts = createSelector(
  selectCartProductIds,
  selectProducts,
  (ids, products) => {
    return ids
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => !!p);
  }
);

export const selectCartProductsCount = createSelector(
  selectCartProductIds,
  (cartProductIds) => cartProductIds.length
);

export const selectTotalAmount = createSelector(
  selectCartProducts,
  (cartProducts) =>
    cartProducts.reduce(
      (acc: number, product: Product) => acc + product.price,
      0
    )
);
