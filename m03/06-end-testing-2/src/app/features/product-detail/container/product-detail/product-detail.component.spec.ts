import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { ProductDetailComponent } from './product-detail.component';
import { ProductDetailStore } from './product-detail.store';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  const mockLoadProductIfNotLoaded = jasmine.createSpy(
    'loadProductIfNotLoaded',
  );

  const mockProductDetailStore = {
    productDetail: signal(null),
    loading: signal(false),
    addToCart: jasmine.createSpy('addToCart'),
    loadProductIfNotLoaded: mockLoadProductIfNotLoaded,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ProductDetailStore,
          useValue: mockProductDetailStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
