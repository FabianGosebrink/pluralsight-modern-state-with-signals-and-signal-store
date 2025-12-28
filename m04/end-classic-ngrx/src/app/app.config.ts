import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { checkoutFeatureKey } from './shared/checkout/store/checkout.state';
import { checkoutReducer } from './shared/checkout/store/checkout.reducer';
import { provideEffects } from '@ngrx/effects';
import * as checkoutEffects from './shared/checkout/store/checkout.effects';
import { productsFeatureKey } from './shared/products/store/products.state';
import { productsReducer } from './shared/products/store/products.reducer';
import * as productsEffects from './shared/products/store/products.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideToastr({ positionClass: 'toast-bottom-right' }),
    provideStore({
      [checkoutFeatureKey]: checkoutReducer,
      [productsFeatureKey]: productsReducer
    }),
    provideEffects([checkoutEffects, productsEffects])
  ]
};
