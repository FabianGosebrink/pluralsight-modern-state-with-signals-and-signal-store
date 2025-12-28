import { createReducer, on } from '@ngrx/store';
import { initialCheckoutState } from './checkout.state';
import { CheckoutApiActions } from './checkout.actions';

export const checkoutReducer = createReducer(
  initialCheckoutState,

  on(
    CheckoutApiActions.addProductSuccess,
    CheckoutApiActions.loadProductsSuccess,
    (state, { products }) => ({
      ...state,
      cartProductsIds: [...products.map(({ id }) => id)]
    })
  ),

  on(CheckoutApiActions.removeProductSuccess, (state, { index }) => {
    const cartProductsIds = [...state.cartProductsIds];

    cartProductsIds.splice(index, 1);

    return {
      ...state,
      cartProductsIds
    };
  })
);
