import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../presentational/header/header.component';
import { ShellStore } from './shell.store';

@Component({
  selector: 'app-shell',
  imports: [HeaderComponent, RouterOutlet],
  template: `
    <app-header [cartProductsCount]="store.cartProductsCount()" class="header" />
    <div class="content">
      <router-outlet />
    </div>
  `,
  styleUrl: './shell.component.scss',
  providers: [ShellStore]
})
export class ShellComponent {
  store = inject(ShellStore);
}
