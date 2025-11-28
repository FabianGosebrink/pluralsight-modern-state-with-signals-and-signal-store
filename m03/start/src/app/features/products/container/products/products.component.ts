import { Component, inject } from '@angular/core';
import { ProductCategoryComponent } from '../../presentational/product-category/product-category.component';
import { ProductsStore } from './products.store';

@Component({
  selector: 'app-products',
  imports: [ProductCategoryComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [ProductsStore]
})
export class ProductsComponent {
  store = inject(ProductsStore);
}
