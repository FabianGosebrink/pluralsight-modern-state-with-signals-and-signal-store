import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Product } from '../../../../shared/models/product.models';
import { AddToCartButtonComponent } from '../add-to-cart-button/add-to-cart-button.component';

@Component({
  selector: 'app-product-info',
  imports: [CurrencyPipe, AddToCartButtonComponent],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss'
})
export class ProductInfoComponent {
  product = input.required<Product>();

  addToCartClicked = output<Product>();
}
