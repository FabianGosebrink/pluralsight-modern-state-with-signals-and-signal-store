import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductImageComponent } from '../../presentational/product-image/product-image.component';
import { ProductInfoComponent } from '../../presentational/product-info/product-info.component';
import { ProductDetailStore } from './product-detail.store';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, ProductImageComponent, ProductInfoComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  providers: [ProductDetailStore]
})
export class ProductDetailComponent implements OnInit {
  store = inject(ProductDetailStore);
  id = input.required<string>();

  ngOnInit() {
    this.store.loadProductIfNotLoaded(this.id);
  }
}
