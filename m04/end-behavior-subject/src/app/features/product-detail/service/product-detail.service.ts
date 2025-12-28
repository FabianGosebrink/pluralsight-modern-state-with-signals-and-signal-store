import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, map, Observable, of, tap } from 'rxjs';
import { Product } from '../../../shared/products/models/product.models';
import { ProductsService } from '../../../shared/products/services/products.service';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {
  readonly #http = inject(HttpClient);
  readonly #productsService = inject(ProductsService);

  readonly #selectedProductId$ = new BehaviorSubject<string | null>(null);

  readonly selectedProduct$ = combineLatest([
    this.#productsService.products$,
    this.#selectedProductId$
  ]).pipe(
    map(([products, id]) => products.find(p => p.id === id) ?? null)
  );

  loadProductDetail(id: string): Observable<any> {
    this.#selectedProductId$.next(id);

    const existingProduct = this.#productsService.currentProducts.find(p => p.id === id);

    if (!existingProduct) {
      return this.#http.get<Product>('http://localhost:3000/products/' + id).pipe(
        tap(product => this.#productsService.addProduct(product))
      );
    }

    return of(null);
  }

  clear(): void {
    this.#selectedProductId$.next(null);
  }
}
