import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RedirectGuard implements CanActivate {

  constructor(private router: Router) {}

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
