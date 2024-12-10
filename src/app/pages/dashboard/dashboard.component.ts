import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import { PerformanceMetricsCreateComponent } from "../../performance/performance-create/performance-create.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NzCardComponent, NavbarComponent, RouterModule, PerformanceMetricsCreateComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) {}
 
  isAdmin = false;

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'Admin';
  }
  navigateToCustomers() {
    this.router.navigate(['/dashboard/customers'], { replaceUrl: true });
  }
}
