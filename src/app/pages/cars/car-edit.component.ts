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
    <h2>Επεξεργασία Αυτοκινήτου</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="max-width: 400px">
      <label>
        Όνομα:
        <input type="text" formControlName="name" />
      </label>
      <br />
      <label>
        Μοντέλο:
        <input type="text" formControlName="model" />
      </label>
      <br />
      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Αποθήκευση</button>
      <button mat-raised-button color="warn" type="button" (click)="onDelete()" *ngIf="carId !== 'new'">Διαγραφή</button>
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
    this.form = this.fb.group({
      name: ['', Validators.required],
      model: ['', Validators.required]
    });

    if (this.carId !== 'new') {
      const car = this.carService.getCarById(+this.carId!);
      if (car) {
        this.form.patchValue(car);
      }
    }
  }

  onSubmit() {
    const carData = this.form.value;

    if (this.carId === 'new') {
      this.carService.addCar(carData);
      this.snackbar.open('Το νέο αυτοκίνητο προστέθηκε!', 'OK', { duration: 3000 });
    } else {
      this.carService.updateCar({ id: +this.carId!, ...carData });
      this.snackbar.open('Το αυτοκίνητο ενημερώθηκε!', 'OK', { duration: 3000 });
    }

    this.router.navigate(['/cars']);
  }

  onDelete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carService.deleteCar(+this.carId!);
        this.snackbar.open('Το αυτοκίνητο διαγράφηκε.', 'OK', { duration: 3000 });
        this.router.navigate(['/cars']);
      }
    });
  }
}