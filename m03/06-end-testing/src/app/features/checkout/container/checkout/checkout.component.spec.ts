import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { CheckoutStore } from './checkout.store';
import { signal } from '@angular/core';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  // Define a mock store structure
  const mockStore = {
    cartProducts: signal([]),
    loading: signal(false),
    totalAmount: signal(0),
    removeFromCart: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
    })
    .overrideComponent(CheckoutComponent, {
      set: {
        providers: [{ provide: CheckoutStore, useValue: mockStore }]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have store injected', () => {
    expect(component.store).toBeDefined();
    expect(component.store.cartProducts()).toEqual([]);
  });
});
