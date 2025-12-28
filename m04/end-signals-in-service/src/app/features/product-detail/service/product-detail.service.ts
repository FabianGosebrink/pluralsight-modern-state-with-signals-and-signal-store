import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Product } from '../../../shared/products/models/product.models';
import { ProductsService } from '../../../shared/products/services/products.service';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {
  readonly #http = inject(HttpClient);
  readonly #productsService = inject(ProductsService);

  readonly #selectedProductId = signal<string | null>(null);

  readonly selectedProduct = computed(() => {
    const id = this.#selectedProductId();
    const products = this.#productsService.products();
    return products.find(p => p.id === id) ?? null;
  });

  loadProductDetail(id: string): Observable<Product | null> {
    this.#selectedProductId.set(id);

    const existingProduct = this.#productsService.products().find(p => p.id === id);

    if (!existingProduct) {
      return this.#http.get<Product>(`http://localhost:3000/products/${id}`).pipe(
        tap(product => this.#productsService.addProduct(product))
      );
    }

    return of(existingProduct);
  }

  clear(): void {
    this.#selectedProductId.set(null);
  }
}
