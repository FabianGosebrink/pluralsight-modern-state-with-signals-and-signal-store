import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { CATEGORY_NAME_MAP, Product, ProductCategory, PRODUCTS } from '../../../../shared/models/product.models';
import { GlobalCheckoutStore } from '../../../../shared/state/global-checkout.store';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

type ProductsState = {
  products: Product[];
};

const initialProductsState: ProductsState = {
  products: []
};

export const ProductsStore = signalStore(
  withState(initialProductsState),
  withComputed((store) => ({
    productsByCategories: computed(() => {
      const products = store.products();
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
      toastrService = inject(ToastrService),
      router = inject(Router)
    ) => ({
      getAll() {
        patchState(store, { products: PRODUCTS });
      },
      addToCart(product: Product) {
        globalCheckoutStore.addToCart(product);
        toastrService.success('Item Added to Cart');
      },
      onProductClicked(id: string): void {
        router.navigate(['products', id]);
      }
    })
  )
);
