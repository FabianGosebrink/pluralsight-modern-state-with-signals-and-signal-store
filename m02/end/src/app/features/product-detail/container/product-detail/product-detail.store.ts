import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Product, PRODUCTS } from '../../../../shared/models/product.models';
import { computed } from '@angular/core';

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
      const existingProduct = globalProductsStore.products().find(x => x.id === productId);

      return existingProduct ?? product;
    })
  })),
  withMethods((store) => ({
    loadProduct(id: string) {
      const product = PRODUCTS.find(p => p.id === '1');

      patchState(store, { product });
    }
  }))
);
