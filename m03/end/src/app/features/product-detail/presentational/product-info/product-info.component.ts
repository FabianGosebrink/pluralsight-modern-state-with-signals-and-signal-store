import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { Product, ProductCategory } from '../../../../shared/models/product.models';
import { AddToCartButtonComponent } from '../add-to-cart-button/add-to-cart-button.component';
import { CATEGORY_NAME_MAP } from '../../../../shared/store/global-products.store';

@Component({
  selector: 'app-product-info',
  imports: [CurrencyPipe, AddToCartButtonComponent],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss'
})
export class ProductInfoComponent {
  product = input.required<Product>();

  addToCartClicked = output<Product>();

  productCategory = computed(() => CATEGORY_NAME_MAP[this.product().category as ProductCategory]);
}
