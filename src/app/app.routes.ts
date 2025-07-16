import { Routes } from '@angular/router';
import { CarsListComponent } from './pages/cars/cars-list.component';
import { CarEditComponent } from './pages/cars/car-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: 'cars', pathMatch: 'full' },
  { path: 'cars', component: CarsListComponent },
  { path: 'cars/new', component: CarEditComponent },
  { path: 'cars/:id', component: CarEditComponent }
];