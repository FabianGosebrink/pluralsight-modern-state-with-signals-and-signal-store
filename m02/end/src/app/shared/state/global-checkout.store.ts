import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '../models/product.models';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

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
      store,
      toastrService = inject(ToastrService)
    ) => ({
      addToCart(product: Product) {
        patchState(store, { products: [...store.products(), product] });
        toastrService.success('Item Added to Cart');
      },
      removeFromCart(index: number) {
        patchState(store, { products: store.products().filter((_, i) => i !== index) });
        toastrService.success('Item removed from Cart');
      }
    })
  )
);
