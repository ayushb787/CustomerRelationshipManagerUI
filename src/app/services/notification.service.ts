import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Notification } from '../models/notification.model';
import { environment } from './environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.baseUrl}/api/notifications`;

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private validateToken(): boolean {
    const token = this.getToken();
    return token !== null; 
  }

  private handleError(error: any): Observable<never> {
    const errorMessage = error.error.message || 'An error occurred';
    console.error(`Error: ${errorMessage}`, error);

    alert(errorMessage); 
    return throwError(() => new Error(errorMessage));
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      alert('Authentication required. Redirecting to login.');
      throw new Error('Authentication token is missing');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getNotifications(userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  markAsRead(notificationId: number): Observable<Notification> {
    const headers = this.getAuthHeaders();
    return this.http.patch<Notification>(`${this.apiUrl}/${notificationId}/read`, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }
}
