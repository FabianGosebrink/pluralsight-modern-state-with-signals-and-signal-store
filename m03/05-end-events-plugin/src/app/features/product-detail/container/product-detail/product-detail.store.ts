import { signalStore, type, withComputed, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { GlobalProductsStore } from '../../../../shared/store/global-products.store';
import { GlobalCheckoutStore } from '../../../../shared/store/global-checkout.store';
import { exhaustMap, filter, tap } from 'rxjs';
import {
  eventGroup,
  Events,
  on,
  withEffects,
  withReducer,
} from '@ngrx/signals/events';
import { ProductDetailService } from '../../service/product-detail.service';
import {
  setLoading,
  setLoadingFinished,
  withLoadingFeature,
} from '../../../../shared/store/loading-feature';
import { Product } from '../../../../shared/models/product.models';
import { mapResponse } from '@ngrx/operators';

export const productDetailPageEvents = eventGroup({
  source: 'Product Detail Page',
  events: {
    opened: type<string>(),
    addToCartClicked: type<Product>(),
  },
});

export const productDetailApiEvents = eventGroup({
  source: 'Product Detail API',
  events: {
    productLoadStarted: type<string>(),
    productLoadedSuccess: type<Product>(),
    productLoadedFailure: type<unknown>(),
  },
});

export const ProductDetailStore = signalStore(
  withState({
    productId: null as string | null,
  }),

  withLoadingFeature(),

  withReducer(
    on(productDetailPageEvents.opened, ({ payload: productId }) => ({
      productId,
    })),

    on(productDetailApiEvents.productLoadStarted, () => setLoading()),

    on(
      productDetailApiEvents.productLoadedSuccess,
      productDetailApiEvents.productLoadedFailure,
      () => setLoadingFinished(),
    ),
  ),

  withComputed((store, globalProductsStore = inject(GlobalProductsStore)) => ({
    productDetail: computed(() => {
      const productId = store.productId() ?? '';
      const existingProduct = globalProductsStore.entityMap()[productId];

      return existingProduct ?? null;
    }),
  })),

  withEffects(
    (
      _store,
      events = inject(Events),
      globalCheckoutStore = inject(GlobalCheckoutStore),
      globalProductsStore = inject(GlobalProductsStore),
      productDetailService = inject(ProductDetailService),
    ) => ({
      loadProduct$: events.on(productDetailPageEvents.opened).pipe(
        filter(({ payload }) => !globalProductsStore.entityMap()[payload]),
        tap(({ payload }) =>
          productDetailApiEvents.productLoadStarted(payload),
        ),
        exhaustMap(({ payload }) =>
          productDetailService.loadProductDetail(payload).pipe(
            mapResponse({
              next: (product) =>
                productDetailApiEvents.productLoadedSuccess(product),
              error: (error: unknown) =>
                productDetailApiEvents.productLoadedFailure(error),
            }),
          ),
        ),
      ),

      addToGlobalStore$: events
        .on(productDetailApiEvents.productLoadedSuccess)
        .pipe(tap(({ payload }) => globalProductsStore.add(payload))),

      addToCart$: events
        .on(productDetailPageEvents.addToCartClicked)
        .pipe(tap(({ payload }) => globalCheckoutStore.addToCart(payload))),

      logErrors$: events
        .on(productDetailApiEvents.productLoadedFailure)
        .pipe(
          tap(({ payload }) =>
            console.error(`Failed to load product`, payload),
          ),
        ),
    }),
  ),
);
