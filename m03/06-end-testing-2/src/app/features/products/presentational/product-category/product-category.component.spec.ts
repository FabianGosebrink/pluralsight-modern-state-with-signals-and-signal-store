import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCategoryComponent } from './product-category.component';
import { Product } from '../../../../shared/models/product.models';

describe('ProductCategoryComponent', () => {
  let component: ProductCategoryComponent;
  let fixture: ComponentFixture<ProductCategoryComponent>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      price: 10.99,
      category: 'book_fantasy',
      imageUrl: 'test1.jpg',
    },
    {
      id: '2',
      name: 'Test Product 2',
      price: 15.99,
      category: 'book_fantasy',
      imageUrl: 'test2.jpg',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCategoryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categoryName', 'Fantasy Books');
    fixture.componentRef.setInput('products', mockProducts);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
