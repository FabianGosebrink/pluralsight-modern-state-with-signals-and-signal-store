import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import {
  addEntities,
  addEntity,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, filter, pipe } from 'rxjs';
import { Product } from '../models/product.models';
import { ProductsService } from '../services/products.service';
import {
  setLoading,
  setLoadingFinished,
  withLoadingFeature,
} from './loading-feature';

export const GlobalProductsStore = signalStore(
  { providedIn: 'root' },
  withEntities<Product>(),
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
                patchState(
                  store,
                  setAllEntities(products),
                  setLoadingFinished(),
                ),
              error: console.error,
            }),
          );
        }),
      ),
    ),
    add(product: Product) {
      patchState(store, addEntity(product));
    },
    addMany(products: Product[]) {
      patchState(store, addEntities(products));
    },
  })),
);
