import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { outputFromObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  imports: [
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  search = new FormControl('', { nonNullable: true });

  searchChanged = outputFromObservable(this.search.valueChanges);
}
