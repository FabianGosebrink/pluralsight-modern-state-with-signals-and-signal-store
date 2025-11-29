import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product, ProductCategory } from '../models/product.models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';

export const CATEGORY_NAME_MAP: Record<ProductCategory, string> = {
  ['book_fantasy']: 'Fantasy Books',
  ['book_history']: 'History Books',
  ['book_romance']: 'Romance Books'
};

type ProductsState = {
  products: Product[];
};

const initialProductsState: ProductsState = {
  products: []
};

export const GlobalProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialProductsState),
  withMethods(
    (store, productsService = inject(ProductsService)) => ({
      getAll: rxMethod<void>(
        exhaustMap(() =>
          productsService.loadProducts().pipe(
            tapResponse({
              next: (products) =>
                patchState(store, { products }),
              error: console.error
            })
          )
        )
      ),
      add(product: Product) {
        patchState(store, { products: [...store.products(), product] });
      }
    })
  )
);
