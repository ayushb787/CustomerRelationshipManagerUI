import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationViewComponent } from "../../notification/notification-view/notification-view.component";
import { AlertNotificationService } from '../../services/alert-notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NzMenuModule, RouterModule, NotificationViewComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  username: string = localStorage.getItem('username') || '';
  role: string = localStorage.getItem('role') || '';
  isAdmin: boolean = this.role === 'Admin';

  isDashboardSelected: boolean = false;
  isLeadsSelected: boolean = false;
  isCustomersSelected: boolean = false;
  isTasksSelected: boolean = false;
  isPerformanceSelected: boolean = false;
  isSignupSelected: boolean = false;

  constructor(private router: Router,
    private alert: AlertNotificationService,) {}

  ngOnInit(): void {
    this.setSelectedMenu();
  }

  setSelectedMenu(): void {
    const currentUrl = this.router.url;

    this.isDashboardSelected = currentUrl.includes('/dashboard');
    this.isLeadsSelected = currentUrl.includes('/dashboard/leads');
    this.isCustomersSelected = currentUrl.includes('/dashboard/customers');
    this.isTasksSelected = currentUrl.includes('/dashboard/tasks') || currentUrl.includes('/dashboard/all-tasks');
    this.isPerformanceSelected = currentUrl.includes('/dashboard/performances');
    this.isSignupSelected = currentUrl.includes('/signup');
  }

  onLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
