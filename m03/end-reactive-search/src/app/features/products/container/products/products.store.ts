import { patchState, signalMethod, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { GlobalProductsStore } from '../../../../shared/state/global-products.store';
import { Product, ProductCategory } from '../../../../shared/models/product.models';
import { GlobalCheckoutStore } from '../../../../shared/state/global-checkout.store';
import { Router } from '@angular/router';

const CATEGORY_NAME_MAP: Record<ProductCategory, string> = {
  ['book_fantasy']: 'Fantasy Books',
  ['book_history']: 'History Books',
  ['book_romance']: 'Romance Books'
};

export const ProductsStore = signalStore(
  withState({
    searchTerm: ''
  }),
  withComputed((store, globalProductsStore = inject(GlobalProductsStore)) => ({
    productsByCategories: computed(() => {
      const products = globalProductsStore.products();
      const productsByCategory = products.reduce(
        (result: Record<string, Product[]>, product: Product) => {
          const { category } = product;
          const resultCategory = result[category] ?? [];

          result[category] = [...resultCategory, product];

          return result;
        },
        {}
      );

      const categories = Object.keys(productsByCategory);

      return categories.map((category) => ({
        category: CATEGORY_NAME_MAP[category as ProductCategory],
        products: productsByCategory[category]
      }));
    })
  })),
  withMethods(
    (
      store,
      globalCheckoutStore = inject(GlobalCheckoutStore),
      globalProductsStore = inject(GlobalProductsStore),
      router = inject(Router)
    ) => ({
      addToCart(product: Product) {
        globalCheckoutStore.addToCart(product);
      },
      loadByQuery: signalMethod<string>((query) => {
        globalProductsStore.loadByQuery(query);
      }),
      onProductClicked(id: string): void {
        router.navigate(['products', id]);
      },
      setSearchTerm(term: string) {
        patchState(store, { searchTerm: term });
      }
    })
  ),
  withHooks({
    onInit(store, globalProductsStore = inject(GlobalProductsStore)) {
      globalProductsStore.loadByQuery(store.searchTerm());
    }
  })
);
