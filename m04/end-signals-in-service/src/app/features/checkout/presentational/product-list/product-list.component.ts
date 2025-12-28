import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ProductListEntryComponent } from '../product-list-entry/product-list-entry.component';
import { Product } from '../../../../shared/products/models/product.models';

@Component({
  selector: 'app-product-list',
  imports: [ProductListEntryComponent, CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  products = input.required<Product[]>();

  totalAmount = input.required<number>();

  removeClicked = output<number>();

  onRemoveClicked(index: number): void {
    this.removeClicked.emit(index);
  }
}
