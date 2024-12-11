import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { CustomerCreateComponent } from './components/customer-create/customer-create.component';
import { LeadListComponent } from './leads/lead-list/lead-list.component';
import { LeadCreateComponent } from './leads/lead-create/lead-create.component';
import { LeadEditComponent } from './leads/lead-edit/lead-edit.component';
import { AuthGuard } from './guards/auth.guard';
import { RedirectGuard } from './guards/redirect.guard';
import { EmailFormComponent } from './components/email-form/email-form.component';
import { AdminGuard } from './guards/admin.guard';
import { TaskCreateComponent } from './tasks/create/create.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskEditComponent } from './tasks/task-edit/task-edit.component';
import { TaskAllListComponent } from './tasks/task-all-list/task-all-list.component';
import { ProfileComponent } from './shared/profile/profile.component';
import { PerformanceMetricsCreateComponent } from './performance/performance-create/performance-create.component';
import { PerformanceMetricsListComponent } from './performance/performance-list/performance-list.component';
import { PerformanceMetricsUpdateComponent } from './performance/performance-edit/performance-edit.component';
import { PerformanceGraphsComponent } from './performance/performance-graphs/performance-graphs.component';
import { NotificationViewComponent } from './notification/notification-view/notification-view.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [RedirectGuard] },  
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent }, 
  { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard] },
  { path: 'dashboard/customers', component: CustomerListComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/customers/create', component: CustomerCreateComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/customers/:id', component: CustomerDetailComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/customers/email/:id', component: EmailFormComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/leads', component: LeadListComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/leads/create', component: LeadCreateComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'dashboard/leads/:id', component: LeadEditComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/tasks/create', component: TaskCreateComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/all-tasks', component: TaskAllListComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'dashboard/tasks/:id', component: TaskEditComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/performance/create', component: PerformanceMetricsCreateComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/performance', component: PerformanceMetricsListComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/performance/graphs', component: PerformanceGraphsComponent, canActivate: [AuthGuard] },
  // { path: 'dashboard/performance/:id', component: PerformanceMetricsUpdateComponent, canActivate: [AuthGuard] },
  {path: 'dashboard/notification', component: NotificationViewComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' }  
];
