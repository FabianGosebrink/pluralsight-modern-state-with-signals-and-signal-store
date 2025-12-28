import { Component, inject, OnInit } from '@angular/core';
import { ProductCategoryComponent } from '../../presentational/product-category/product-category.component';
import { SearchComponent } from '../../presentational/search/search.component';
import { Store } from '@ngrx/store';
import { selectProductsByCategories } from '../../../../shared/products/store/products.selectors';
import { ProductsUserActions } from '../../../../shared/products/store/products.actions';
import { Product } from '../../../../shared/products/models/product.models';
import { CheckoutUserActions } from '../../../../shared/checkout/store/checkout.actions';

@Component({
  selector: 'app-products',
  imports: [ProductCategoryComponent, SearchComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  private readonly store = inject(Store);

  readonly productsByCategories = this.store.selectSignal(
    selectProductsByCategories
  );

  ngOnInit(): void {
    this.store.dispatch(ProductsUserActions.loadProducts());
  }

  onProductClicked(id: string): void {
    this.store.dispatch(ProductsUserActions.navigateToDetail({ id }));
  }

  addToCart(product: Product): void {
    this.store.dispatch(CheckoutUserActions.addProduct({ product }));
  }

  searchValueChanged(searchTerm: string): void {

  }
}
