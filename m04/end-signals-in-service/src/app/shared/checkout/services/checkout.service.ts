import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ProductsService } from '../../products/services/products.service';
import { Product } from '../../products/models/product.models';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  readonly #baseUrl = 'http://localhost:3000/cart/';
  readonly #http = inject(HttpClient);
  readonly #productsService = inject(ProductsService);

  readonly #cartProductIds = signal<string[]>([]);

  readonly cartProducts = computed(() => {
    const ids = this.#cartProductIds();
    const allProducts = this.#productsService.products();
    return ids
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is Product => !!p);
  });

  getCartProducts(): Observable<Product[]> {
    return this.#http.get<Product[]>(this.#baseUrl).pipe(
      tap(products => {
        this.#cartProductIds.set(products.map(p => p.id));
        this.#productsService.addProducts(products);
      })
    );
  }

  addToCart(product: Product): Observable<Product[]> {
    return this.#http.post<Product[]>(this.#baseUrl, product).pipe(
      tap(() => {
        this.#cartProductIds.update(ids => [...ids, product.id]);
      })
    );
  }

  removeFromCart(index: number): Observable<any> {
    return this.#http.delete(this.#baseUrl + index).pipe(
      tap(() => {
        this.#cartProductIds.update(ids => ids.filter((_, i) => i !== index));
      })
    );
  }
}
