import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../../shared/models/product.models';
import { CategoryNamePipe } from '../../../../shared/pipes/category-name.pipe';
import { CheckoutService } from '../../../../shared/services/checkout.service';
import { ProductCategoryComponent } from '../../presentational/product-category/product-category.component';
import { ProductsService } from '../../service/products.service';

@Component({
  selector: 'app-products',
  imports: [ProductCategoryComponent, CategoryNamePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  products = signal<{ category: string; products: Product[] }[]>([]);
  private readonly productsService = inject(ProductsService);
  private readonly checkoutService = inject(CheckoutService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.productsService.loadProducts().subscribe((products) => {
      const categoryProductMap = products.reduce(
        (result: Record<string, Product[]>, product) => {
          const category = product.category;

          if (!result[category]) {
            result[category] = [];
          }

          result[category].push(product);

          return result;
        },
        {},
      );

      const groupedByCategory = Object.keys(categoryProductMap).map(
        (category) => ({
          category,
          products: categoryProductMap[category],
        }),
      );

      this.products.set(groupedByCategory);
    });
  }

  onProductClicked(id: string): void {
    this.router.navigate(['products', id]);
  }

  onCartClicked(product: Product): void {
    this.checkoutService.addToCart(product).subscribe(() => {
      this.toastrService.success('Item Added to Cart');
    });
  }
}
