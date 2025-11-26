import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { GlobalProductsStore } from '../../../../shared/state/global-products.store';
import { GlobalCheckoutStore } from '../../../../shared/state/global-checkout.store';
import { Product } from '../../../../shared/models/product.models';
import { ToastrService } from 'ngx-toastr';

export const CheckoutStore = signalStore(
  withComputed((_store, globalProductsStore = inject(GlobalProductsStore), globalCheckoutStore = inject(GlobalCheckoutStore)) => {

    const cartProducts = computed(() => {
      const productMap = new Map(
        globalProductsStore.products().map(product => [product.id, product])
      );

      return globalCheckoutStore.productIds()
        .map(productId => productMap.get(productId))
        .filter((p): p is Product => !!p);
    });

    return {
      cartProducts,
      totalAmount: computed(() => {
        return calculateTotalAmount(cartProducts());
      })
    };
  }),
  withMethods(
    (
      _store, globalCheckoutStore = inject(GlobalCheckoutStore), toastrService = inject(ToastrService)
    ) => ({
      removeFromCart(index: number) {
        globalCheckoutStore.removeFromCart(index);
        toastrService.success('Item removed from Cart');
      }
    })
  )
);

function calculateTotalAmount(products: Product[]) {
  return products.reduce((acc: number, prev) => acc + prev.price, 0);
}
