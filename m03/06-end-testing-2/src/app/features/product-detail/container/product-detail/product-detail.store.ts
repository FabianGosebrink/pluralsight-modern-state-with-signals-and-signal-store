import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { GlobalProductsStore } from '../../../../shared/store/global-products.store';
import { GlobalCheckoutStore } from '../../../../shared/store/global-checkout.store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, filter, pipe, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ProductDetailService } from '../../service/product-detail.service';
import { setLoading, setLoadingFinished, withLoadingFeature } from '../../../../shared/store/loading-feature';

export const ProductDetailStore = signalStore(
  withLoadingFeature(),
  withState({
    productId: null as string | null
  }),
  withComputed((store, globalProductsStore = inject(GlobalProductsStore)) => ({
    productDetail: computed(() => {
      const productId = store.productId() ?? '';
      const existingProduct = globalProductsStore.entityMap()[productId];

      return existingProduct ?? null;
    })
  })),
  withMethods(
    (
      store,
      globalCheckoutStore = inject(GlobalCheckoutStore),
      globalProductsStore = inject(GlobalProductsStore),
      productDetailService = inject(ProductDetailService)
    ) => ({
      addToCart: globalCheckoutStore.addToCart,
      loadProductIfNotLoaded: rxMethod<string>(
        pipe(
          tap((productId) => patchState(store, { productId })),
          filter((productId) => !globalProductsStore.entityMap()[productId]),
          tap(() => patchState(store, setLoading())),
          exhaustMap((id) =>
            productDetailService.loadProductDetail(id).pipe(
              tapResponse({
                next: (product) => {
                  patchState(store, setLoadingFinished());

                  globalProductsStore.add(product);
                },
                error: console.error
              })
            )
          )
        )
      )
    })
  )
);
