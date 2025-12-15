import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Product } from '../models/product.models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, filter, pipe } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { CheckoutService } from '../services/checkout.service';
import { computed, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { withLoadingFeature } from './loading-feature';
import { GlobalProductsStore } from './global-products.store';

type CheckoutState = {
  productIds: string[];
};

const initialCheckoutState: CheckoutState = {
  productIds: []
};

export const GlobalCheckoutStore = signalStore(
  { providedIn: 'root' },
  withState(initialCheckoutState),
  withLoadingFeature(),
  withComputed((store, globalProductsStore = inject(GlobalProductsStore)) => ({
    products: computed(() => {
      const byId = globalProductsStore.products()
        .reduce<Record<string, Product>>((acc, p) => {
          acc[p.id] = p;

          return acc;
        }, {});

      return store
        .productIds()
        .map((id) => byId[id])
        .filter((p): p is Product => !!p);
    })
  })),
  withMethods(
    (
      store,
      checkoutService = inject(CheckoutService),
      toastrService = inject(ToastrService),
      globalProductsStore = inject(GlobalProductsStore)
    ) => ({
      loadProductsIfNotLoaded: rxMethod<void>(
        pipe(
          filter(() => !globalProductsStore.products().length),
          exhaustMap(() =>
            checkoutService.getCartProducts().pipe(
              tapResponse({
                next: (products) => {
                  globalProductsStore.addMany(products);

                  patchState(store, { productIds: products.map(x => x.id) });
                },
                error: console.error
              })
            )
          )
        )
      ),

      addToCart: rxMethod<Product>(
        exhaustMap((product) =>
          checkoutService.addToCart(product).pipe(
            tapResponse({
                next: () => {
                  toastrService.success('Item Added to Cart');
                  patchState(store, { productIds: [...store.productIds(), product.id] });
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
                toastrService.success('Item removed from Cart');
                patchState(store, {
                  productIds: store.productIds().filter((_, i) => i !== index)
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
    onInit({ loadProductsIfNotLoaded }) {
      loadProductsIfNotLoaded();
    }
  })
);
