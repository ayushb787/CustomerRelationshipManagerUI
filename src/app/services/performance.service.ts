import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './environment';
import { AlertNotificationService } from './alert-notification.service';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  private apiUrl = `${environment.baseUrl}/api/performance-metrics`;
  
  constructor(private http: HttpClient,
    private alert: AlertNotificationService,) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleError(error: any): Observable<never> {
    const errorMessage = error.error.message || 'An error occurred';
    const errorData = error.error.data || {};

    let alertMessage = errorMessage;

    if (Object.keys(errorData).length > 0) {
      alertMessage += '\n' + Object.entries(errorData)
        .map(([field, message]) => `${message}`)
        .join('\n');
    }
 
    this.alert.alertNotification(alertMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }

  getPerformances(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getPerformanceById(id: number): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createPerformance(performance: any): Observable<any> {
    if (performance.date) {
      performance.date = `${performance.date}T00:00:00`;  
    }
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, performance, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updatePerformance(id: number, performance: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/${id}`, performance, { headers }).pipe(
      catchError(this.handleError) 
    );
  }

  deletePerformance(id: number): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError) 
    );
  }
}
