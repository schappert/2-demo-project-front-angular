import { Routes } from '@angular/router';
import {ProductsComponent} from './pages/products/products.component';
import {LoginComponent} from './auth/login/login.component';
import {authGuard} from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] }
];
