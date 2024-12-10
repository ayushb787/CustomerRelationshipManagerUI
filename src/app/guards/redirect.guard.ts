import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertNotificationService } from '../services/alert-notification.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectGuard implements CanActivate {

  constructor(private router: Router,
    private alert: AlertNotificationService,) {}

  canActivate(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.router.navigate(['/dashboard']);
        return false; 
      }
    }
    return true;
  }
}
