import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertNotificationService } from '../services/alert-notification.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router,
    private alert: AlertNotificationService,) {}

  canActivate(): boolean {
    const role = localStorage.getItem('role');
    if (role === 'Admin') {
      return true;  
    } else { 
      this.router.navigate(['/unauthorized']);
      return false;  
    }
  }
}
