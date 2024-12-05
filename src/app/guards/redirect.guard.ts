import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RedirectGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Redirect to dashboard if token exists
      this.router.navigate(['/dashboard']);
      return false; // Prevent the default route for login
    }

    // Allow access to login if no token is found
    return true;
  }
}
