import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { CATEGORY_NAME_MAP, Product, ProductCategory, PRODUCTS } from '../../../../shared/models/product.models';
import { computed, inject } from '@angular/core';
import { GlobalCheckoutStore } from '../../../../shared/state/global-checkout.store';

type ProductDetailState = {
  product: Product | null;
};

const initialProductDetailState: ProductDetailState = {
  product: null
};

export const ProductDetailStore = signalStore(
  withState<ProductDetailState>(initialProductDetailState),
  withComputed((store) => ({
    productDetail: computed(() => {
      const existingProduct = store.product();

      if (existingProduct) {
        return { ...existingProduct, category: CATEGORY_NAME_MAP[existingProduct.category as ProductCategory] };
      }

      return null;
    })
  })),
  withMethods((store,
               globalCheckoutStore = inject(GlobalCheckoutStore)) => ({
    loadProduct(id: string) {
      const product = PRODUCTS.find(p => p.id === id);

      patchState(store, { product });
    },
    addToCart(product: Product) {
      globalCheckoutStore.addToCart(product);
    }
  }))
);
