import { patchState, signalStore, withComputed, withHooks, withMethods } from '@ngrx/signals';
import { Product } from '../models/product.models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { CheckoutService } from '../services/checkout.service';
import { computed, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { setLoading, setLoadingFinished, withLoadingFeature } from './loading-feature';
import { addEntities, addEntity, removeEntity, withEntities } from '@ngrx/signals/entities';

export const GlobalCheckoutStore = signalStore(
  { providedIn: 'root' },
  withLoadingFeature(),
  withEntities<Product>(),
  withComputed((store) => ({
    products: computed(() => store.entities())
  })),
  withMethods(
    (
      store,
      checkoutService = inject(CheckoutService),
      toastrService = inject(ToastrService)
    ) => ({
      loadAll: rxMethod<void>(
        exhaustMap(() => {
            patchState(store, setLoading());
            return checkoutService.getCartProducts().pipe(
              tapResponse({
                next: (products) => patchState(store, addEntities(products), setLoadingFinished()),
                error: console.error
              })
            );
          }
        )
      ),

      addToCart: rxMethod<Product>(
        exhaustMap((product) =>
          checkoutService.addToCart(product).pipe(
            tapResponse({
                next: () => {
                  toastrService.success('Item Added to Cart');
                  patchState(store, addEntity(product));
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
                const product = store.products()[index];

                toastrService.success('Item removed from Cart');
                patchState(store, removeEntity(product.id));
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
