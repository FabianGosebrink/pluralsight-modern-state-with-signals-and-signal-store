import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import * as checkoutEffects from './shared/checkout/store/checkout.effects';
import { checkoutReducer } from './shared/checkout/store/checkout.reducer';
import { checkoutFeatureKey } from './shared/checkout/store/checkout.state';
import * as productsEffects from './shared/products/store/products.effects';
import { productsReducer } from './shared/products/store/products.reducer';
import { productsFeatureKey } from './shared/products/store/products.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideToastr({ positionClass: 'toast-bottom-right' }),
    provideStore({
      [checkoutFeatureKey]: checkoutReducer,
      [productsFeatureKey]: productsReducer,
    }),
    provideEffects([checkoutEffects, productsEffects]),
  ],
};
