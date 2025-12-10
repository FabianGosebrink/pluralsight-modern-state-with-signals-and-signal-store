import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product, PRODUCTS } from '../../../../shared/models/product.models';
import { inject } from '@angular/core';
import { GlobalCheckoutStore } from '../../../../shared/store/global-checkout.store';

type ProductDetailState = {
  product: Product | null;
};

const initialProductDetailState: ProductDetailState = {
  product: null
};

export const ProductDetailStore = signalStore(
  withState<ProductDetailState>(initialProductDetailState),
  withMethods((store, globalCheckoutStore = inject(GlobalCheckoutStore)) => ({
    loadProduct(id: string) {
      const product = PRODUCTS.find(p => p.id === id);

      patchState(store, { product });
    },
    addToCart: globalCheckoutStore.addToCart
  }))
);
