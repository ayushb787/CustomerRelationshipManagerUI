import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertNotificationService } from '../../services/alert-notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  username: string = localStorage.getItem('username') || 'User';
  role: string = localStorage.getItem('role') || 'User';

  constructor(private router: Router,
    private alert: AlertNotificationService,) {}

  onLogout(): void {
    // Logout confirmation
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }
}
