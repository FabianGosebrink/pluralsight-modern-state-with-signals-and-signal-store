import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../presentational/header/header.component';
import { CheckoutService } from '../../../../shared/checkout/services/checkout.service';

@Component({
  selector: 'app-shell',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  private readonly checkoutService = inject(CheckoutService);

  readonly cartProductsCount = computed(() => this.checkoutService.cartProducts().length);

  ngOnInit(): void {
    this.checkoutService.getCartProducts().subscribe();
  }
}
