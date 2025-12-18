import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ProductDetailStore } from './product-detail.store';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  const mockStore = {
    productId: signal('1'),
    loading: signal(false),
    productDetail: signal({
      id: '1',
      name: 'Test Product',
      price: 100,
      imageUrl: 'test.jpg',
      category: 'book_fantasy',
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        provideRouter([]),
      ],
    })
    .overrideComponent(ProductDetailComponent, {
      set: {
        providers: [{ provide: ProductDetailStore, useValue: mockStore }]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('id', '1');

    vi.spyOn(component.dispatch, 'opened');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch opened event on init with the id from input', () => {
    expect(component.dispatch.opened).toHaveBeenCalledWith('1');
  });

  it('should display product detail from store', () => {
    expect(component.store.productDetail()).toBeDefined();
    expect(component.store.productDetail()?.name).toBe('Test Product');
  });
});
