import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { CarService, Car } from './car.service';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Επιβεβαίωση Διαγραφής</h2>
    <mat-dialog-content>Είσαι σίγουρος/η ότι θέλεις να διαγράψεις αυτό το αυτοκίνητο;</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Ακύρωση</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Διαγραφή</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDeleteDialogComponent {}

@Component({
  selector: 'app-car-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  template: `
    <h2>{{ isEditMode ? 'Επεξεργασία Αυτοκινήτου' : 'Προσθήκη Νέου Αυτοκινήτου' }}</h2>

    <form [formGroup]="carForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Μάρκα</mat-label>
        <input matInput formControlName="brand" required />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Μοντέλο</mat-label>
        <input matInput formControlName="model" required />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Περιγραφή</mat-label>
        <textarea matInput formControlName="description"></textarea>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Ημερομηνία</mat-label>
        <input matInput formControlName="date" type="date" />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Τιμή ανά ημέρα</mat-label>
        <input matInput formControlName="price_per_day" type="number" required min="0" />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Ποσότητα</mat-label>
        <input matInput formControlName="quantity" type="number" required min="0" />
      </mat-form-field>

      <div class="actions">
        <button mat-raised-button color="primary" type="submit" [disabled]="carForm.invalid">
          {{ isEditMode ? 'Αποθήκευση' : 'Προσθήκη' }}
        </button>

        <button mat-raised-button color="warn" *ngIf="isEditMode" (click)="onDelete()" type="button">
          Διαγραφή
        </button>

        <button mat-button type="button" (click)="onCancel()">Άκυρο</button>
      </div>
    </form>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 1rem; }
    .actions { display: flex; gap: 1rem; margin-top: 1rem; }
  `]
})
export class CarEditComponent implements OnInit {
  carForm!: FormGroup;
  isEditMode = false;
  carId?: number;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private carService = inject(CarService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  ngOnInit() {
  this.carForm = this.fb.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    description: [''],
    date: [''],
    price_per_day: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  const stateCar = history.state?.car as Car | undefined;

  if (stateCar) {
    this.isEditMode = true;
    this.carId = stateCar.car_id;
    this.carForm.patchValue(stateCar);
  }
}
    

  loadCar(id: number) {
    this.carService.getCarById(id).subscribe({
      next: (car) => this.carForm.patchValue(car),
      error: () => {
        this.snackBar.open('Αποτυχία φόρτωσης του αυτοκινήτου.', 'ΟΚ', { duration: 3000 });
        this.router.navigate(['/cars']);
      }
    });
  }

  onSubmit() {

    if (this.carForm.invalid) return;

    const carData: Car = this.carForm.value;
    if (this.isEditMode && this.carId) {
      carData.car_id = this.carId;
      this.carService.updateCar(this.carId, carData).subscribe({
        next: () => {
          this.snackBar.open('Το αυτοκίνητο ενημερώθηκε.', 'ΟΚ', { duration: 3000 });
          this.router.navigate(['/cars']);
        },
        error: () => this.snackBar.open('Αποτυχία ενημέρωσης.', 'ΟΚ', { duration: 3000 }),
      });
    } else {
      this.carService.addCar(carData).subscribe({
        next: () => {
          this.snackBar.open('Το αυτοκίνητο προστέθηκε.', 'ΟΚ', { duration: 3000 });
          this.router.navigate(['/cars']);
        },
        error: () => this.snackBar.open('Αποτυχία προσθήκης.', 'ΟΚ', { duration: 3000 }),
      });
    }
  }

  onDelete() {
    if (!this.carId) return;

    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.carService.deleteCar(this.carId!).subscribe({
          next: () => {
            this.snackBar.open('Το αυτοκίνητο διαγράφηκε.', 'ΟΚ', { duration: 3000 });
            this.router.navigate(['/cars']);
          },
          error: () => this.snackBar.open('Αποτυχία διαγραφής.', 'ΟΚ', { duration: 3000 }),
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/cars']);
  }
}