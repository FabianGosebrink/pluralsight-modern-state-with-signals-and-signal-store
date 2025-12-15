import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { Product } from '../models/product.models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { CheckoutService } from '../services/checkout.service';
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
      checkoutService = inject(CheckoutService),
      toastrService = inject(ToastrService)
    ) => ({
      loadAll: rxMethod<void>(
        exhaustMap(() => checkoutService.getCartProducts().pipe(
            tapResponse({
              next: (products) => patchState(store, { products }),
              error: console.error
            })
          )
        )
      ),

      addToCart: rxMethod<Product>(
        exhaustMap((product) =>
          checkoutService.addToCart(product).pipe(
            tapResponse({
                next: (products) => {
                  toastrService.success('Item Added to Cart');
                  patchState(store, { products });
                },
                error: console.error
              }
            )
          )
        )),

      removeFromCart: rxMethod<number>(
        exhaustMap((index) =>
          checkoutService.removeFromCart(index).pipe(
            tapResponse({
              next: () => {
                const cartProducts = [...store.products()];

                cartProducts.splice(index, 1);

                toastrService.success('Item removed from Cart');
                patchState(store, {
                  products: cartProducts
                });
              },
              error: console.error
            })
          )
        )
      )
    })
  ),
  withHooks({
    onInit({ loadAll }) {
      loadAll();
    }
  })
);
