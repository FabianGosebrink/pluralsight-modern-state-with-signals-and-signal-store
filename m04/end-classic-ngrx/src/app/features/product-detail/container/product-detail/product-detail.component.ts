import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductImageComponent } from '../../presentational/product-image/product-image.component';
import { ProductInfoComponent } from '../../presentational/product-info/product-info.component';
import { Store } from '@ngrx/store';
import { ProductDetailActions } from '../../store/product-detail.actions';
import { Product } from '../../../../shared/products/models/product.models';
import { CheckoutUserActions } from '../../../../shared/checkout/store/checkout.actions';
import { selectProductDetail } from '../../store/product-detail.selectors';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, ProductImageComponent, ProductInfoComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  id = input.required<string>();
  private readonly store = inject(Store);
  productDetail = this.store.selectSignal(selectProductDetail);

  ngOnInit() {
    this.store.dispatch(ProductDetailActions.loadProduct({ id: this.id() }));
  }

  addToCart(product: Product): void {
    this.store.dispatch(CheckoutUserActions.addProduct({ product }));
  }
}
