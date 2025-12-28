import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  readonly #products = signal<Product[]>([]);
  readonly products = this.#products.asReadonly();

  loadProducts(query: string = ''): Observable<Product[]> {
    const options = query ? { params: { query } } : {};

    return this.http.get<Product[]>('http://localhost:3000/products', options).pipe(
      tap(products => this.#products.set(products))
    );
  }

  addProducts(newProducts: Product[]): void {
    this.#products.update(current => {
      const filteredNew = newProducts.filter(
        (newP) => !current.some((p) => p.id === newP.id)
      );
      return filteredNew.length > 0 ? [...current, ...filteredNew] : current;
    });
  }

  addProduct(product: Product): void {
    this.#products.update(current => {
      if (!current.some(x => x.id === product.id)) {
        return [...current, product];
      }
      return current;
    });
  }
}
