import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product } from '../models/product.models';

export const ProductsApiActions = createActionGroup({
  source: 'Products API',
  events: {
    'Load Products Success': props<{ products: Product[] }>(),
    'Load Products Failure': props<{ error: HttpErrorResponse }>(),
    'Add Product From Details': props<{ product: Product }>(),
    'Add Products From Checkout': props<{ products: Product[] }>()
  }
});

export const ProductsUserActions = createActionGroup({
  source: 'Products User',
  events: {
    'Load Products': emptyProps(),
    'Navigate To Detail': props<{ id: string }>(),
    'Search Product': props<{ searchTerm: string }>()
  }
});
