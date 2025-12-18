import { TestBed } from '@angular/core/testing';
import { ProductsStore } from './products.store';
import { GlobalProductsStore } from '../../../../shared/store/global-products.store';
import { GlobalCheckoutStore } from '../../../../shared/store/global-checkout.store';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { Product } from '../../../../shared/models/product.models';

describe('ProductsStore', () => {
  let store: InstanceType<typeof ProductsStore>;
  let globalProductsStoreMock: any;
  let globalCheckoutStoreMock: any;
  let router: Router;

  const mockProducts: Product[] = [
    { id: '1', name: 'P1', price: 10, category: 'book_fantasy', imageUrl: '1.jpg' },
    { id: '2', name: 'P2', price: 20, category: 'book_history', imageUrl: '2.jpg' },
  ];

  beforeEach(() => {
    globalProductsStoreMock = {
      loading: signal(false),
      entities: signal(mockProducts),
      loadByQuery: vi.fn(),
    };

    globalCheckoutStoreMock = {
      addToCart: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductsStore,
        provideRouter([]),
        { provide: GlobalProductsStore, useValue: globalProductsStoreMock },
        { provide: GlobalCheckoutStore, useValue: globalCheckoutStoreMock },
      ],
    });

    store = TestBed.inject(ProductsStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with default state', () => {
    expect(store.searchTerm()).toBe('');
  });

  it('should update searchTerm when searchValueChanged is called', () => {
    store.searchValueChanged('test');
    expect(store.searchTerm()).toBe('test');
  });

  it('should call globalCheckoutStore.addToCart when addToCart is called', () => {
    const product = mockProducts[0];
    store.addToCart(product);
    expect(globalCheckoutStoreMock.addToCart).toHaveBeenCalledWith(product);
  });

  it('should call globalProductsStore.loadByQuery when loadByQuery is called', () => {
    store.loadByQuery('test');
    expect(globalProductsStoreMock.loadByQuery).toHaveBeenCalledWith('test');
  });

  it('should navigate to product details when onProductClicked is called', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    store.onProductClicked('1');
    expect(navigateSpy).toHaveBeenCalledWith(['products', '1']);
  });

  it('should compute productsByCategories correctly', () => {
    const result = store.productsByCategories();

    expect(result.length).toBe(2);
    expect(result).toContainEqual({
      category: 'Fantasy Books',
      products: [mockProducts[0]],
    });
    expect(result).toContainEqual({
      category: 'History Books',
      products: [mockProducts[1]],
    });
  });

  it('should expose loading signal from globalProductsStore', () => {
    globalProductsStoreMock.loading.set(true);
    expect(store.loading()).toBe(true);
  });
});
