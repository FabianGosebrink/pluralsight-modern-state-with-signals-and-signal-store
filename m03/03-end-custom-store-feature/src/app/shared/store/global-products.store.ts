import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '../models/product.models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, exhaustMap, filter, pipe } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { setLoading, setLoadingFinished, withLoadingFeature } from './loading-feature';

type ProductsState = {
  products: Product[];
};

const initialProductsState: ProductsState = {
  products: []
};

export const GlobalProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialProductsState),
  withLoadingFeature(),
  withMethods(
    (store, productsService = inject(ProductsService)) => ({
      getAll: rxMethod<void>(
        exhaustMap(() => {
            patchState(store, setLoading());

            return productsService.loadProducts().pipe(
              tapResponse({
                next: (products) =>
                  patchState(store, { products }, setLoadingFinished()),
                error: console.error
              })
            );
          }
        )
      ),
      loadByQuery: rxMethod<string>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          filter((query) => query.length > 2 || !query),
          exhaustMap((query) => productsService.loadProducts(query).pipe(
            tapResponse({
              next: (products) => patchState(store, { products }),
              error: console.error
            })
          ))
        )
      ),
      add(product: Product) {
        patchState(store, { products: [...store.products(), product] });
      },
      addMany(products: Product[]) {
        patchState(store, { products });
      }
    })
  )
);
