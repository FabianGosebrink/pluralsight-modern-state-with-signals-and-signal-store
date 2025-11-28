import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { GlobalCheckoutStore } from '../../../../shared/store/global-checkout.store';
import { Product } from '../../../../shared/models/product.models';


export const CheckoutStore = signalStore(
  withComputed((_store, globalCheckoutStore = inject(GlobalCheckoutStore)) => {
    const cartProducts = computed(() => globalCheckoutStore.products() ?? [] as Product[]);

    return {
      cartProducts,
      totalAmount: computed(() => calculateTotalAmount(cartProducts()))
    };
  }),
  withMethods(
    (
      _store, globalCheckoutStore = inject(GlobalCheckoutStore)
    ) => ({
      removeFromCart(index: number) {
        globalCheckoutStore.removeFromCart(index);
      }
    })
  )
);

function calculateTotalAmount(products: Product[]) {
  return products.reduce((acc: number, prev) => acc + prev.price, 0);
}
