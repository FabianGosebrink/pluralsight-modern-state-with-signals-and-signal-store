import { signalStore, type, withComputed, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { GlobalProductsStore } from '../../../../shared/store/global-products.store';
import { GlobalCheckoutStore } from '../../../../shared/store/global-checkout.store';
import { exhaustMap, filter, map, tap } from 'rxjs';
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
    loadProduct: type<string>(),
    loadProductSuccess: type<Product>(),
    loadProductFailure: type<unknown>(),
  },
});

export const ProductDetailStore = signalStore(
  withState({
    productId: null as string | null,
  }),

  withLoadingFeature(),

  withReducer(
    on(productDetailPageEvents.opened, ({ payload }) => [
      { productId: payload },
    ]),

    on(productDetailApiEvents.loadProduct, () => setLoading()),

    on(
      productDetailApiEvents.loadProductSuccess,
      productDetailApiEvents.loadProductFailure,
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
      loadProductIfNotAlreadyPresent$: events
        .on(productDetailPageEvents.opened)
        .pipe(
          filter(({ payload }) => !globalProductsStore.entityMap()[payload]),
          map(({ payload }) => productDetailApiEvents.loadProduct(payload)),
        ),

      loadProduct$: events.on(productDetailApiEvents.loadProduct).pipe(
        exhaustMap(({ payload }) =>
          productDetailService.loadProductDetail(payload).pipe(
            mapResponse({
              next: (product) =>
                productDetailApiEvents.loadProductSuccess(product),
              error: (error: unknown) =>
                productDetailApiEvents.loadProductFailure(error),
            }),
          ),
        ),
      ),

      addToGlobalStore$: events
        .on(productDetailApiEvents.loadProductSuccess)
        .pipe(tap(({ payload }) => globalProductsStore.add(payload))),

      addToCart$: events
        .on(productDetailPageEvents.addToCartClicked)
        .pipe(tap(({ payload }) => globalCheckoutStore.addToCart(payload))),

      logErrors$: events
        .on(productDetailApiEvents.loadProductFailure)
        .pipe(
          tap(({ payload }) =>
            console.error(`Failed to load product`, payload),
          ),
        ),
    }),
  ),
);
