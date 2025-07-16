import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarService, Car } from './car.service';
import { OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cars-list',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,],
  template: `
   <h2>Λίστα Αυτοκινήτων</h2>

<div style="margin-bottom: 1rem;">
  <button mat-raised-button color="primary" [routerLink]="['/cars/new']">Προσθήκη</button>
</div>

<div *ngIf="cars.length > 0; else empty">
  <mat-card *ngFor="let car of cars" style="margin-bottom: 1rem;">
    <mat-card-title>{{ car.name }} - {{ car.model }}</mat-card-title>
    <mat-card-actions>
      <button mat-button color="accent" [routerLink]="['/cars', car.id]">Επεξεργασία</button>
      <button mat-button color="warn" (click)="deleteCar(car.id)">Διαγραφή</button>
    </mat-card-actions>
  </mat-card>
</div>

<ng-template #empty>
  <p>Δεν υπάρχουν αυτοκίνητα.</p>
</ng-template>
 `
})
export class CarsListComponent implements OnInit {
  cars: Car[] = [];

  constructor(private carService: CarService, private snackbar: MatSnackBar) {}

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.carService.getCars().subscribe({
      next: (cars) => (this.cars = cars),
      error: () =>
        this.snackbar.open('Αποτυχία φόρτωσης των αυτοκινήτων.', 'ΟΚ', {
          duration: 3000,
        }),
    });
  }

   deleteCar(id: number | undefined) {
    if (!id) return;

    this.carService.deleteCar(id).subscribe({
      next: () => {
        this.snackbar.open('Το αυτοκίνητο διαγράφηκε.', 'ΟΚ', { duration: 3000 });
        this.loadCars(); // refresh
      },
      error: () =>
        this.snackbar.open('Αποτυχία διαγραφής του αυτοκινήτου.', 'ΟΚ', {
          duration: 3000,
        }),
    });
   }
  }
