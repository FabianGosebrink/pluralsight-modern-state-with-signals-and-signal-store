import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductImageComponent } from '../../presentational/product-image/product-image.component';
import { ProductInfoComponent } from '../../presentational/product-info/product-info.component';
import { Product } from '../../../../shared/products/models/product.models';
import { ProductDetailService } from '../../service/product-detail.service';
import { CheckoutService } from '../../../../shared/checkout/services/checkout.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, ProductImageComponent, ProductInfoComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  id = input.required<string>();

  private readonly productDetailService = inject(ProductDetailService);
  productDetail = this.productDetailService.selectedProduct;
  private readonly checkoutService = inject(CheckoutService);

  ngOnInit() {
    // If the ID input changes via routing, we fetch the data
    this.productDetailService.loadProductDetail(this.id()).subscribe();
  }

  addToCart(product: Product): void {
    this.checkoutService.addToCart(product).subscribe();
  }

  ngOnDestroy() {
    this.productDetailService.clear();
  }
}
