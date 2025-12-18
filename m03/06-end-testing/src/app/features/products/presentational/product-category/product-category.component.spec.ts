import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryComponent } from './product-category.component';
import { Product } from '../../../../shared/models/product.models';

describe('ProductCategoryComponent', () => {
  let component: ProductCategoryComponent;
  let fixture: ComponentFixture<ProductCategoryComponent>;

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 100,
    imageUrl: 'test.jpg',
    category: 'book_fantasy',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCategoryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categoryName', 'Fantasy Books');
    fixture.componentRef.setInput('products', [mockProduct]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
