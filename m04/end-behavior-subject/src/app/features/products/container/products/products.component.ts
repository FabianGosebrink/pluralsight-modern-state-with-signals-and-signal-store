import { Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CheckoutService } from '../../../../shared/checkout/services/checkout.service';
import { Product } from '../../../../shared/products/models/product.models';
import { ProductsService } from '../../../../shared/products/services/products.service';
import { ProductCategoryComponent } from '../../presentational/product-category/product-category.component';
import { SearchComponent } from '../../presentational/search/search.component';

@Component({
  selector: 'app-products',
  imports: [ProductCategoryComponent, SearchComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly checkoutService = inject(CheckoutService);
  private readonly router = inject(Router);

  readonly #products = toSignal(this.productsService.products$, {
    initialValue: [],
  });

  readonly productsByCategories = computed(() => {
    const products = this.#products();
    const categories = [...new Set(products.map((p) => p.category))];

    return categories.map((category) => ({
      category,
      products: products.filter((p) => p.category === category),
    }));
  });

  ngOnInit(): void {
    this.productsService.loadProducts().subscribe();
  }

  onProductClicked(id: string): void {
    this.router.navigate(['/products', id]);
  }

  addToCart(product: Product): void {
    this.checkoutService.addToCart(product).subscribe();
  }

  searchValueChanged(searchTerm: string): void {
    this.productsService.loadProducts(searchTerm).subscribe();
  }
}
