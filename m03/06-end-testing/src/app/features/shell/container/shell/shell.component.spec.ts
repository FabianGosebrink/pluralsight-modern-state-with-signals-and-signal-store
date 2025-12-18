import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShellComponent } from './shell.component';
import { ShellStore } from './shell.store';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  const mockStore = {
    cartProductsCount: signal(0),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [provideRouter([])],
    })
    .overrideComponent(ShellComponent, {
      set: {
        providers: [{ provide: ShellStore, useValue: mockStore }]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have store with cartProductsCount', () => {
    expect(component.store.cartProductsCount()).toBe(0);
  });
});
