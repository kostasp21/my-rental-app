import { Routes, RouterModule } from '@angular/router';
import { carsRoutes } from './pages/cars/cars.routes';  
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './auth/register.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: 'cars', children: carsRoutes },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}