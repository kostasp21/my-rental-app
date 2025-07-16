import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CarService } from './car.service';
import { Car } from './car.model';

@Component({
  selector: 'confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Επιβεβαίωση</h2>
    <mat-dialog-content>Είσαι σίγουρος ότι θέλεις να διαγράψεις;</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Άκυρο</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Διαγραφή</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {}

@Component({
  selector: 'app-car-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    ConfirmDialogComponent
  ],
  template: `
    <h2>{{ carId && carId !== 'new' ? 'Επεξεργασία Αυτοκινήτου' : 'Προσθήκη Νέου Αυτοκινήτου' }}</h2>

    <form *ngIf="form" [formGroup]="form" (ngSubmit)="onSubmit()" style="max-width: 400px">
      <label>
        Μάρκα:
        <input type="text" formControlName="brand" />
      </label>
      <br />
      <label>
        Μοντέλο:
        <input type="text" formControlName="model" />
      </label>
      <br />
      <label>
        Τιμή ανά ημέρα:
        <input type="number" formControlName="price_per_day" />
      </label>
      <br />
      <label>
        Ποσότητα:
        <input type="number" formControlName="quantity" />
      </label>
      <br />
      <label>
        Ημερομηνία:
        <input type="date" formControlName="date" />
      </label>
      <br />
      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
        {{ carId && carId !== 'new' ? 'Αποθήκευση' : 'Προσθήκη' }}
      </button>
      <button mat-raised-button color="warn" type="button" (click)="onDelete()" *ngIf="carId && carId !== 'new'">
        Διαγραφή
      </button>
    </form>
  `
})
export class CarEditComponent implements OnInit {
  carId: string | null = null;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private carService: CarService
  ) {}

  ngOnInit() {
  this.carId = this.route.snapshot.paramMap.get('id');

console.log('Car ID from route:', this.carId);
 
  this.form = this.fb.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    price_per_day: ['', Validators.required],
    quantity: ['', Validators.required],
    date: ['', Validators.required]
  });

  if (this.carId && this.carId !== 'new') {
    const idNumber = Number(this.carId);
    if (isNaN(idNumber)) {
      this.snackbar.open('Μη έγκυρο ID αυτοκινήτου.', 'OK', { duration: 3000 });
      this.router.navigate(['/cars']);
      return;
    }

    this.carService.getCarById(idNumber).subscribe({
      next: (car) => {
        if (car) {
          this.form.patchValue(car);
        } else {
          this.snackbar.open('Το αυτοκίνητο δεν βρέθηκε.', 'OK', { duration: 3000 });
          this.router.navigate(['/cars']);
        }
      },
      error: () => {
        this.snackbar.open('Αποτυχία φόρτωσης του αυτοκινήτου.', 'OK', { duration: 3000 });
        this.router.navigate(['/cars']);
      }
    });
  }
}

  onSubmit() {
    if (this.form.invalid) return;

    const carData = this.form.value;

    if (this.carId && this.carId !== 'new') {
      // Update
      this.carService.updateCar({ id: +this.carId, ...carData }).subscribe({
        next: () => {
          this.snackbar.open('Το αυτοκίνητο ενημερώθηκε!', 'OK', { duration: 3000 });
          this.router.navigate(['/cars']);
        },
        error: () => this.snackbar.open('Αποτυχία ενημέρωσης.', 'OK', { duration: 3000 }),
      });
    } else {
      // Add new
      this.carService.addCar(carData).subscribe({
        next: () => {
          this.snackbar.open('Το νέο αυτοκίνητο προστέθηκε!', 'OK', { duration: 3000 });
          this.router.navigate(['/cars']);
        },
        error: () => this.snackbar.open('Αποτυχία προσθήκης.', 'OK', { duration: 3000 }),
      });
    }
  }

  onDelete() {
  if (!this.carId || this.carId === 'new') return;

  const idNumber = Number(this.carId);
  if (isNaN(idNumber)) {
    this.snackbar.open('Μη έγκυρο ID αυτοκινήτου.', 'OK', { duration: 3000 });
    this.router.navigate(['/cars']);
    return;
  }

  const dialogRef = this.dialog.open(ConfirmDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.carService.deleteCar(idNumber).subscribe({
        next: () => {
          this.snackbar.open('Το αυτοκίνητο διαγράφηκε.', 'OK', { duration: 3000 });
          this.router.navigate(['/cars']);
        },
        error: () => {
          this.snackbar.open('Αποτυχία διαγραφής.', 'OK', { duration: 3000 });
        }
      });
    }
  });
}
}