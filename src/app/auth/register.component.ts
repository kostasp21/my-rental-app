import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from './auth.service'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  template: `
  
    <h2>Εγγραφή Χρήστη</h2>
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Username</mat-label>
        <input matInput formControlName="username" required />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" type="email" required />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Κωδικός</mat-label>
        <input matInput formControlName="password" type="password" required />
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid">
        Εγγραφή
      </button>
    </form>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 1rem; }`]
})
export class RegisterComponent {
  registerForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snackBar.open('Εγγραφή επιτυχής!', 'ΟΚ', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: () => {
        this.snackBar.open('Αποτυχία εγγραφής.', 'ΟΚ', { duration: 3000 });
      }
    });
  }
}