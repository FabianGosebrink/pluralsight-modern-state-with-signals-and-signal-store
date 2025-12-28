import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, filter, map, mergeMap, tap } from 'rxjs';
import { CheckoutService } from '../services/checkout.service';
import { CheckoutApiActions, CheckoutUserActions } from './checkout.actions';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { selectProducts } from '../../products/store/products.selectors';
import { ProductsApiActions } from '../../products/store/products.actions';

export const loadProducts$ = createEffect(
  (actions$ = inject(Actions), checkoutService = inject(CheckoutService), store = inject(Store)) =>
    actions$.pipe(
      ofType(CheckoutUserActions.loadProducts),
      concatLatestFrom(() => store.select(selectProducts)),
      filter(([_, products]) => products.length <= 1),
      exhaustMap(() =>
        checkoutService
          .getCartProducts()
          .pipe(
            mergeMap((products) =>
              [
                CheckoutApiActions.loadProductsSuccess({ products }),
                ProductsApiActions.addProductsFromCheckout({ products })
              ]
            )
          )
      )
    ),
  { functional: true }
);

export const addProduct$ = createEffect(
  (
    actions$ = inject(Actions),
    checkoutService = inject(CheckoutService),
    toastrService = inject(ToastrService)
  ) =>
    actions$.pipe(
      ofType(CheckoutUserActions.addProduct),
      exhaustMap(({ product }) =>
        checkoutService.addToCart(product).pipe(
          tap(() => toastrService.success('Item Added to Cart')),
          map((products) => CheckoutApiActions.addProductSuccess({ products }))
        )
      )
    ),
  { functional: true }
);

export const removeProduct$ = createEffect(
  (
    actions$ = inject(Actions),
    checkoutService = inject(CheckoutService),
    toastrService = inject(ToastrService)
  ) =>
    actions$.pipe(
      ofType(CheckoutUserActions.removeProduct),
      exhaustMap(({ index }) =>
        checkoutService.removeFromCart(index).pipe(
          tap(() => toastrService.success('Removed Item from Cart')),
          map(() => CheckoutApiActions.removeProductSuccess({ index }))
        )
      )
    ),
  { functional: true }
);
