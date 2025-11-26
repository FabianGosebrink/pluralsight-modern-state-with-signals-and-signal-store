import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { GlobalProductsStore } from '../../../../shared/state/global-products.store';
import { GlobalCheckoutStore } from '../../../../shared/state/global-checkout.store';
import { Product } from '../../../../shared/models/product.models';

export const ProductDetailStore = signalStore(
  withState({
    productId: null as string | null
  }),
  withComputed((store, globalProductsStore = inject(GlobalProductsStore)) => ({
    product: computed(() => {
      const productId = store.productId();
      const product = globalProductsStore.products().find(x => x.id === productId);

      return product ?? null;
    })
  })),
  withMethods(
    (
      store, globalCheckoutStore = inject(GlobalCheckoutStore)
    ) => ({
      loadProduct(productId: string) {
        patchState(store, { productId });
      },
      addToCart(product: Product) {
        globalCheckoutStore.addToCart(product.id);
      }
    })
  )
);
