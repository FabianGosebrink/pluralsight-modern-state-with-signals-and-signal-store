import { signalStore, withComputed, withHooks, withMethods } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { CATEGORY_NAME_MAP, GlobalProductsStore } from '../../../../shared/store/global-products.store';
import { Product, ProductCategory } from '../../../../shared/models/product.models';
import { GlobalCheckoutStore } from '../../../../shared/store/global-checkout.store';
import { Router } from '@angular/router';


export const ProductsStore = signalStore(
  withComputed((_store, globalProductsStore = inject(GlobalProductsStore)) => ({
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
      _store,
      globalCheckoutStore = inject(GlobalCheckoutStore),
      router = inject(Router)
    ) => ({
      addToCart(product: Product) {
        globalCheckoutStore.addToCart(product);
      },
      onProductClicked(id: string): void {
        router.navigate(['products', id]);
      }
    })
  ),
  withHooks({
    onInit(_, globalProductsStore = inject(GlobalProductsStore)) {
      globalProductsStore.getAll();
    }
  })
);
