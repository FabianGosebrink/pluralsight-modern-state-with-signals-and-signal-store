import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  loadProducts(query: string = ''): Observable<Product[]> {
    const options = query ? { params: { query } } : {};

    return this.http.get<Product[]>('http://localhost:3000/products', options);
  }
}
