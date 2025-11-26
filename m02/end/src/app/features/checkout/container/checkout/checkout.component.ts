import { Component, inject } from '@angular/core';
import { ProductListComponent } from '../../presentational/product-list/product-list.component';
import { CheckoutStore } from './checkout.store';

@Component({
  selector: 'app-checkout',
  imports: [ProductListComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  providers: [CheckoutStore]
})
export class CheckoutComponent {
  store = inject(CheckoutStore);
}
