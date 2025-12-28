import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { catchError, exhaustMap, filter, mergeMap, of } from 'rxjs';
import { ProductDetailService } from '../service/product-detail.service';
import { ProductDetailActions } from './product-detail.actions';
import { selectProducts } from '../../../shared/products/store/products.selectors';
import { Store } from '@ngrx/store';
import { ProductsApiActions } from '../../../shared/products/store/products.actions';

export const loadProductIfNotPresent$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    productDetailService = inject(ProductDetailService)
  ) =>
    actions$.pipe(
      ofType(ProductDetailActions.loadProduct),
      filter(Boolean),
      concatLatestFrom(() => store.select(selectProducts)),
      filter(([action, products]) => {
        const isLoaded = products.some(p => p.id === action.id);

        return !isLoaded;
      }),
      exhaustMap(([{ id }]) =>
        productDetailService.loadProductDetail(id ?? '').pipe(
          mergeMap((product) =>
            [
              ProductDetailActions.loadProductSuccess({ product }),
              ProductsApiActions.addProductFromDetails({ product })
            ]
          ),
          catchError((error: HttpErrorResponse) =>
            of(ProductDetailActions.loadProductFailure({ error }))
          )
        )
      )
    ),
  { functional: true }
);
