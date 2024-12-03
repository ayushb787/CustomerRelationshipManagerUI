import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { CustomerCreateComponent } from './components/customer-create/customer-create.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard] },
  { path: 'dashboard/customers', component: CustomerListComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/customers/create', component: CustomerCreateComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/customers/:id', component: CustomerDetailComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
