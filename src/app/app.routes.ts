import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './login/auth.guard';
import { CarsListComponent } from './pages/cars/cars-list.component';
import { RegisterComponent } from './auth/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'cars', component: CarsListComponent, canActivate: [authGuard] }
];