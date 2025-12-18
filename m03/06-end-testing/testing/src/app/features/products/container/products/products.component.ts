import { Component, inject } from '@angular/core';
import { ProductCategoryComponent } from '../../presentational/product-category/product-category.component';
import { ProductsStore } from './products.store';
import { SearchComponent } from '../../presentational/search/search.component';

@Component({
  selector: 'app-products',
  imports: [ProductCategoryComponent, SearchComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [ProductsStore]
})
export class ProductsComponent {
  store = inject(ProductsStore);

  constructor() {
    const query = this.store.searchTerm;
    this.store.loadByQuery(query);
  }
}
