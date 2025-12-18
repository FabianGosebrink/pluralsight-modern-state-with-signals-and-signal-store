import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductsStore } from './products.store';
import { signal } from '@angular/core';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  const mockStore = {
    searchTerm: signal(''),
    loading: signal(false),
    productsByCategories: signal([]),
    addToCart: vi.fn(),
    loadByQuery: vi.fn(),
    onProductClicked: vi.fn(),
    searchValueChanged: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
    })
    .overrideComponent(ProductsComponent, {
      set: {
        providers: [{ provide: ProductsStore, useValue: mockStore }]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadByQuery in constructor', () => {
    expect(mockStore.loadByQuery).toHaveBeenCalled();
  });
});
