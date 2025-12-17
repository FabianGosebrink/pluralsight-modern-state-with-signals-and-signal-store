import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, filter, pipe } from 'rxjs';
import { Product } from '../models/product.models';
import { ProductsService } from '../services/products.service';
import {
  setLoading,
  setLoadingFinished,
  withLoadingFeature,
} from './loading-feature';

type ProductsState = {
  products: Product[];
};

const initialProductsState: ProductsState = {
  products: [],
};

export const GlobalProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialProductsState),
  withLoadingFeature(),
  withMethods((store, productsService = inject(ProductsService)) => ({
    loadByQuery: rxMethod<string>(
      pipe(
        filter((query) => query.length > 2 || !query),
        exhaustMap((query) => {
          patchState(store, setLoading());

          return productsService.loadProducts(query).pipe(
            tapResponse({
              next: (products) =>
                patchState(store, { products }, setLoadingFinished()),
              error: console.error,
            }),
          );
        }),
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
