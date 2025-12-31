import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CheckoutService } from '../../../../shared/checkout/services/checkout.service';
import { ProductListComponent } from '../../presentational/product-list/product-list.component';

@Component({
  selector: 'app-checkout',
  imports: [ProductListComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  private readonly checkoutService = inject(CheckoutService);
  readonly cartProducts = toSignal(this.checkoutService.cartProducts$, {
    initialValue: [],
  });
  readonly totalAmount = computed(() =>
    this.cartProducts().reduce((acc, product) => acc + product.price, 0),
  );

  removeFromCart(index: number): void {
    this.checkoutService.removeFromCart(index).subscribe();
  }
}
