import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, tap } from 'rxjs';
import { Product } from '../../products/models/product.models';
import { ProductsService } from '../../products/services/products.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  readonly #baseUrl = 'http://localhost:3000/cart/';
  readonly #http = inject(HttpClient);
  readonly #productsService = inject(ProductsService);

  readonly #cartProductIds$ = new BehaviorSubject<string[]>([]);

  readonly cartProducts$ = combineLatest([
    this.#cartProductIds$,
    this.#productsService.products$,
  ]).pipe(
    map(([ids, allProducts]) =>
      ids
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is Product => !!p),
    ),
  );

  getCartProducts(): Observable<Product[]> {
    return this.#http.get<Product[]>(this.#baseUrl).pipe(
      tap((products) => {
        const ids = products.map((p) => p.id);
        this.#cartProductIds$.next(ids);

        this.#productsService.addProducts(products);
      }),
    );
  }

  addToCart(product: Product): Observable<Product[]> {
    return this.#http.post<Product[]>(this.#baseUrl, product).pipe(
      tap(() => {
        const currentIds = this.#cartProductIds$.getValue();
        this.#cartProductIds$.next([...currentIds, product.id]);
      }),
    );
  }

  removeFromCart(index: number): Observable<any> {
    return this.#http.delete(this.#baseUrl + index).pipe(
      tap(() => {
        const currentIds = this.#cartProductIds$.getValue();
        this.#cartProductIds$.next(currentIds.filter((_, i) => i !== index));
      }),
    );
  }
}
