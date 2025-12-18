import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { Product } from '../../../../shared/models/product.models';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  const mockProduct:Product = {
    id: '1',
    name: 'Test Product',
    price: 100,
    imageUrl: 'test.jpg',
    category: 'book_fantasy',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('products', [mockProduct]);
    fixture.componentRef.setInput('totalAmount', 999);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
