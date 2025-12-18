import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListEntryComponent } from './product-list-entry.component';
import { Product } from '../../../../shared/models/product.models';

describe('ProductListEntryComponent', () => {
  let component: ProductListEntryComponent;
  let fixture: ComponentFixture<ProductListEntryComponent>;

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 10.99,
    category: 'book_fantasy',
    imageUrl: 'test.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListEntryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListEntryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
