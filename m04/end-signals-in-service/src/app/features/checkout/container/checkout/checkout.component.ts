import { Component, computed, inject } from '@angular/core';
import { ProductListComponent } from '../../presentational/product-list/product-list.component';
import { CheckoutService } from '../../../../shared/checkout/services/checkout.service';

@Component({
  selector: 'app-checkout',
  imports: [ProductListComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  readonly totalAmount = computed(() =>
    this.cartProducts().reduce((acc, product) => acc + product.price, 0)
  );
  private readonly checkoutService = inject(CheckoutService);
  readonly cartProducts = this.checkoutService.cartProducts;

  removeFromCart(index: number): void {
    this.checkoutService.removeFromCart(index).subscribe();
  }
}
