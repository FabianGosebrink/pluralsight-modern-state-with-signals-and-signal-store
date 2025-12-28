import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../presentational/header/header.component';
import { CheckoutService } from '../../../../shared/checkout/services/checkout.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-shell',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  private readonly checkoutService = inject(CheckoutService);

  readonly cartProductsCount = toSignal(
    this.checkoutService.cartProducts$.pipe(
      map(products => products.length)
    ),
    { initialValue: 0 }
  );

  ngOnInit(): void {
    this.checkoutService.getCartProducts().subscribe();
  }
}
