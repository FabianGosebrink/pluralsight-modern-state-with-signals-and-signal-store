import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { GlobalProductsStore } from '../../../../shared/state/global-products.store';
import { GlobalCheckoutStore } from '../../../../shared/state/global-checkout.store';
import { Product } from '../../../../shared/models/product.models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, filter, pipe, tap } from 'rxjs';
import { ProductsService } from '../../../../shared/services/products.service';
import { tapResponse } from '@ngrx/operators';

export const ProductDetailStore = signalStore(
  withState({
    _product: null as Product | null,
    productId: null as string | null
  }),
  withComputed((store, globalProductsStore = inject(GlobalProductsStore)) => ({
    productDetail: computed(() => {
      const productId = store.productId();
      const product = store._product();

      const existingProduct = globalProductsStore.products().find(x => x.id === productId);

      return existingProduct ?? product;
    })
  })),
  withMethods(
    (
      store,
      globalCheckoutStore = inject(GlobalCheckoutStore),
      globalProductsStore = inject(GlobalProductsStore),
      productsService = inject(ProductsService)
    ) => ({
      addToCart(product: Product) {
        globalCheckoutStore.addToCart(product);
      },
      loadProductIfNotLoaded: rxMethod<string>(
        pipe(
          tap((productId) => patchState(store, { productId })),
          filter((productId) => !globalProductsStore.products().find(x => x.id === productId)),
          exhaustMap((id) =>
            productsService.loadSingleProduct(id).pipe(
              tapResponse({
                next: (product) => patchState(store, { _product: product }),
                error: console.error
              })
            )
          )
        )
      )
    })
  )
);
