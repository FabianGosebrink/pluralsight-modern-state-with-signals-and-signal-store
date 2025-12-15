import { patchState, signalStore, withComputed, withMethods } from '@ngrx/signals';
import { Product } from '../models/product.models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, exhaustMap, filter, pipe } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { setLoading, setLoadingFinished, withLoadingFeature } from './loading-feature';
import { addEntities, addEntity, withEntities } from '@ngrx/signals/entities';


export const GlobalProductsStore = signalStore(
  { providedIn: 'root' },
  withEntities<Product>(),
  withComputed((store) => ({
    products: computed(() => store.entities())
  })),
  withLoadingFeature(),
  withMethods(
    (store, productsService = inject(ProductsService)) => ({
      getAll: rxMethod<void>(
        exhaustMap(() => {
            patchState(store, setLoading());

            return productsService.loadProducts().pipe(
              tapResponse({
                next: (products) =>
                  patchState(store, addEntities(products), setLoadingFinished()),
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
        patchState(store, addEntity(product));
      }
    })
  )
);
