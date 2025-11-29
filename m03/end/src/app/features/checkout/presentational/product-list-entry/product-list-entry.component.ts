import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { CATEGORY_NAME_MAP, Product, ProductCategory } from '../../../../shared/models/product.models';

@Component({
  selector: 'app-product-list-entry',
  imports: [NgOptimizedImage, CurrencyPipe],
  templateUrl: './product-list-entry.component.html',
  styleUrl: './product-list-entry.component.scss'
})
export class ProductListEntryComponent {
  product = input.required<Product>();

  removeClicked = output();

  productCategory = computed(() => CATEGORY_NAME_MAP[this.product().category as ProductCategory]);
}
