import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
  
  <h2>Σύνδεση</h2>
    <form [formGroup]="form" (ngSubmit)="onLogin()">
      <input formControlName="email" placeholder="Email" type="email" required />
      <input formControlName="password" placeholder="Κωδικός" type="password" required />
      <button type="submit">Σύνδεση</button>
    </form>
    <p *ngIf="error">{{ error }}</p>
    <nav>

  <a routerLink="/login">Σύνδεση</a>
  <a routerLink="/register">Εγγραφή</a>
</nav>
  `
})
export class LoginComponent {
  form: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.form.invalid) return;

    this.http.post<{ token: string }>('http://localhost:3000/api/login', this.form.value)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/cars']);
        },
        error: () => {
          this.error = 'Λάθος στοιχεία σύνδεσης.';
        }
      });
  }
}