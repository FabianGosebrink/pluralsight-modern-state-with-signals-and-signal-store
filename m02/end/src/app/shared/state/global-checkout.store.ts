import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type CheckoutState = {
  productIds: string[];
};

const initialCheckoutState: CheckoutState = {
  productIds: []
};

export const GlobalCheckoutStore = signalStore(
  { providedIn: 'root' },
  withState(initialCheckoutState),
  withMethods(
    (
      store
    ) => ({
      addToCart(productId: string) {
        patchState(store, { productIds: [...store.productIds(), productId] });
      },
      removeFromCart(index: number) {
        patchState(store, { productIds: store.productIds().filter((_, i) => i !== index) });
      }
    })
  )
);
