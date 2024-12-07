import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  username: string = localStorage.getItem('username') || 'User';
  role: string = localStorage.getItem('role') || 'User';

  constructor(private router: Router) {}

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
