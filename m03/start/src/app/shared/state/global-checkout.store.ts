import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '../models/product.models';

type CheckoutState = {
  products: Product[];
};

const initialCheckoutState: CheckoutState = {
  products: []
};

export const GlobalCheckoutStore = signalStore(
  { providedIn: 'root' },
  withState(initialCheckoutState),
  withMethods(
    (
      store
    ) => ({
      addToCart(product: Product) {
        patchState(store, { products: [...store.products(), product] });
      },
      removeFromCart(index: number) {
        patchState(store, { products: store.products().filter((_, i) => i !== index) });
      }
    })
  )
);
