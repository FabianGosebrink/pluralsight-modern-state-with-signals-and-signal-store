import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  readonly #products$ = new BehaviorSubject<Product[]>([]);

  readonly products$ = this.#products$.asObservable();

  get currentProducts(): Product[] {
    return this.#products$.getValue();
  }

  loadProducts(query: string = ''): Observable<Product[]> {
    const options = query ? { params: { query } } : {};

    return this.http.get<Product[]>('http://localhost:3000/products', options).pipe(
      tap(products => this.#products$.next(products))
    );
  }

  addProducts(newProducts: Product[]): void {
    const current = this.currentProducts;

    const filteredNew = newProducts.filter(
      (newP) => !current.some((p) => p.id === newP.id)
    );

    if (filteredNew.length > 0) {
      this.#products$.next([...current, ...filteredNew]);
    }
  }

  addProduct(product: Product): void {
    const current = this.currentProducts;

    if (!current.map(x => x.id).includes(product.id)) {
      this.#products$.next([...current, product]);
    }
  }
}
