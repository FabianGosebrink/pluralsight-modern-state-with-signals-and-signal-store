import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '../models/product.models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, exhaustMap, pipe } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';

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
      loadByQuery: rxMethod<string>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          exhaustMap((query) => productsService.loadProducts(query).pipe(
            tapResponse({
              next: (products) => patchState(store, { products }),
              error: console.error
            })
          ))
        )
      )
    })
  )
);
