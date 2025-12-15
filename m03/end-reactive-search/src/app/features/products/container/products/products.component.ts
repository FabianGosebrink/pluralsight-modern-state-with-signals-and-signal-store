import { Component, inject } from '@angular/core';
import { ProductCategoryComponent } from '../../presentational/product-category/product-category.component';
import { ProductsStore } from './products.store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [ProductCategoryComponent, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [ProductsStore]
})
export class ProductsComponent {
  store = inject(ProductsStore);
  search = new FormControl('', { nonNullable: true });

  constructor() {
    this.store.searchValueChanged(this.search.valueChanges);

    const query = this.store.searchTerm;
    this.store.loadByQuery(query);
  }
}
