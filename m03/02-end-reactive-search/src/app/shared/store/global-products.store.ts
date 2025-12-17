import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, filter, pipe, tap } from 'rxjs';
import { Product } from '../models/product.models';
import { ProductsService } from '../services/products.service';

type ProductsState = {
  products: Product[];
};

const initialProductsState: ProductsState = {
  products: [],
};

export const GlobalProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialProductsState),
  withMethods((store, productsService = inject(ProductsService)) => ({
    getAll: rxMethod<void>(
      exhaustMap(() =>
        productsService.loadProducts().pipe(
          tapResponse({
            next: (products) => patchState(store, { products }),
            error: console.error,
          }),
        ),
      ),
    ),
    loadByQuery: rxMethod<string>(
      pipe(
        tap(() => console.log('@@@@')),
        filter((query) => query.length > 2 || !query),
        exhaustMap((query) =>
          productsService.loadProducts(query).pipe(
            tapResponse({
              next: (products) => patchState(store, { products }),
              error: console.error,
            }),
          ),
        ),
      ),
    ),
    add(product: Product) {
      patchState(store, { products: [...store.products(), product] });
    },
    addMany(products: Product[]) {
      patchState(store, { products });
    },
  })),
);
