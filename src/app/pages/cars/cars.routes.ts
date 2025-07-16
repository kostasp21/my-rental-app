import { Routes } from '@angular/router';
import { CarsListComponent } from './cars-list.component';
import { CarEditComponent } from './car-edit.component';

export const carsRoutes: Routes = [
  { path: '', component: CarsListComponent },
  { path: 'new', component: CarEditComponent },
  { path: ':id', component: CarEditComponent }
];