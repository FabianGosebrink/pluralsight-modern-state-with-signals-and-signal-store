import { signalStore, withComputed } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { GlobalCheckoutStore } from '../../../../shared/state/global-checkout.store';

export const ShellStore = signalStore(
  withComputed((_store, globalCheckoutStore = inject(GlobalCheckoutStore)) => ({
    cartProductsCount: computed(() => globalCheckoutStore.products().length)
  }))
);
