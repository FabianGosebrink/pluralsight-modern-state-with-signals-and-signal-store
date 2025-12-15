import { Component, output } from '@angular/core';

@Component({
  selector: 'app-add-to-cart-button',
  templateUrl: './add-to-cart-button.component.html',
  styleUrl: './add-to-cart-button.component.scss',
})
export class AddToCartButtonComponent {
  clicked = output();
}
