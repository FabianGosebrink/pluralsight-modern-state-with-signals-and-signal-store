import { TestBed } from '@angular/core/testing';
import { GlobalProductsStore } from './global-products.store';
import { ProductsService } from '../services/products.service';
import { of } from 'rxjs';
import { Product } from '../models/product.models';

describe('GlobalProductsStore', () => {
  let store: InstanceType<typeof GlobalProductsStore>;
  let productsServiceMock: any;

  const mockProducts: Product[] = [
    { id: '1', name: 'Product 1', price: 10, category: 'book_fantasy', imageUrl: '1.jpg' },
    { id: '2', name: 'Product 2', price: 20, category: 'book_history', imageUrl: '2.jpg' },
  ];

  beforeEach(() => {
    productsServiceMock = {
      loadProducts: vi.fn().mockReturnValue(of(mockProducts)),
    };

    TestBed.configureTestingModule({
      providers: [
        GlobalProductsStore,
        { provide: ProductsService, useValue: productsServiceMock },
      ],
    });

    store = TestBed.inject(GlobalProductsStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty entities', () => {
    expect(store.entities()).toEqual([]);
    expect(store.entityMap()).toEqual({});
    expect(store.ids()).toEqual([]);
    expect(store.loading()).toBe(false);
  });

  it('should update entity computed properties when adding products', () => {
    const products: Product[] = [
      { id: '1', name: 'P1', price: 10, category: 'book_fantasy', imageUrl: '1.jpg' },
      { id: '2', name: 'P2', price: 20, category: 'book_history', imageUrl: '2.jpg' },
    ];

    store.addMany(products);

    expect(store.ids()).toEqual(['1', '2']);
    expect(store.entities()).toEqual(products);
    expect(store.entityMap()['1']).toEqual(products[0]);
    expect(store.entityMap()['2']).toEqual(products[1]);
    expect(store.entityMap()).toMatchSnapshot();
  });

  it('should add an entity when add is called', () => {
    const newProduct: Product = {
      id: '3',
      name: 'Product 3',
      price: 30,
      category: 'book_romance',
      imageUrl: '3.jpg',
    };

    store.add(newProduct);

    expect(store.entities()).toContainEqual(newProduct);
    expect(store.entityMap()['3']).toEqual(newProduct);
  });

  it('should load products when loadByQuery is called with a valid query', () => {
    store.loadByQuery('fantasy');

    expect(productsServiceMock.loadProducts).toHaveBeenCalledWith('fantasy');
    expect(store.entities()).toEqual(mockProducts);
    expect(store.loading()).toBe(false);
  });

  it('should not load products when loadByQuery is called with a short query', () => {
    store.loadByQuery('fa'); // Length < 3

    expect(productsServiceMock.loadProducts).not.toHaveBeenCalled();
  });

  it('should load products when loadByQuery is called with an empty query', () => {
    store.loadByQuery('');

    expect(productsServiceMock.loadProducts).toHaveBeenCalledWith('');
    expect(store.entities()).toEqual(mockProducts);
  });
});
