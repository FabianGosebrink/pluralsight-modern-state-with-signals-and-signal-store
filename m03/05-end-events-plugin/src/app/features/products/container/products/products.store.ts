import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  CATEGORY_NAME_MAP,
  Product,
  ProductCategory,
} from '../../../../shared/models/product.models';
import { GlobalCheckoutStore } from '../../../../shared/store/global-checkout.store';
import { GlobalProductsStore } from '../../../../shared/store/global-products.store';

export const ProductsStore = signalStore(
  withState({
    searchTerm: '',
  }),
  withComputed((_store, globalProductsStore = inject(GlobalProductsStore)) => ({
    loading: globalProductsStore.loading,
    productsByCategories: computed(() => {
      const products = globalProductsStore.entities();
      const productsByCategory = products.reduce(
        (result: Record<string, Product[]>, product: Product) => {
          const { category } = product;
          const resultCategory = result[category] ?? [];

          result[category] = [...resultCategory, product];

          return result;
        },
        {},
      );

      const categories = Object.keys(productsByCategory);

      return categories.map((category) => ({
        category: CATEGORY_NAME_MAP[category as ProductCategory],
        products: productsByCategory[category],
      }));
    }),
  })),
  withMethods(
    (
      store,
      globalCheckoutStore = inject(GlobalCheckoutStore),
      globalProductsStore = inject(GlobalProductsStore),
      router = inject(Router),
    ) => ({
      addToCart: globalCheckoutStore.addToCart,
      loadByQuery: globalProductsStore.loadByQuery,
      onProductClicked(id: string): void {
        router.navigate(['products', id]);
      },
      searchValueChanged(searchTerm: string) {
        patchState(store, { searchTerm });
      },
    }),
  ),
);
