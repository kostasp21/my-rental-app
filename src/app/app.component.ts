import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav>
      <p>Δεν έχεις λογαριασμό; </p>
      <a routerLink="/register">Εγγραφή</a>
      
    </nav>

    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
