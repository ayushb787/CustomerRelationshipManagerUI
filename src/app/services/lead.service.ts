import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Lead } from '../models/lead.model';
import { environment } from './environment';
import { AlertNotificationService } from './alert-notification.service';

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  private apiUrl = `${environment.baseUrl}/api/leads`;

  constructor(private http: HttpClient,
    private alert: AlertNotificationService,) {}
 
  private getToken(): string | null {
    return localStorage.getItem('token');
  }
 
  private validateToken(): boolean {
    const token = this.getToken();
    return token !== null; 
  }
 
  private handleError(error: any): Observable<never> {
    const errorMessage = error.error.message || 'An error occurred'; 
 
    this.alert.alertNotification(errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }
 
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) { 
      this.alert.alertNotification('Authentication required. Redirecting to login', 'error');
      throw new Error('Authentication token is missing');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
 
  getLeads(): Observable<Lead[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Lead[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getPaginatedLeads(page: number, pageSize: number): Observable<Lead[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Lead[]>(`${this.apiUrl}?page=${page}&size=${pageSize}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getLeadById(leadId: number): Observable<Lead> {
    const headers = this.getAuthHeaders();
    return this.http.get<Lead>(`${this.apiUrl}/${leadId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
 
  createLead(lead: Partial<Lead>): Observable<Lead> {
    const headers = this.getAuthHeaders();
    return this.http.post<Lead>(this.apiUrl, lead, { headers }).pipe(
      catchError(this.handleError)
    );
  }
 
  updateLead(leadId: number, lead: Partial<Lead>): Observable<Lead> {
    const headers = this.getAuthHeaders();
    return this.http.put<Lead>(`${this.apiUrl}/${leadId}`, lead, { headers }).pipe(
      catchError(this.handleError)
    );
  } 

  deleteLead(leadId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${leadId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getUsers(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${environment.baseUrl}/api/leads/users?role=Salesperson`, { headers }).pipe(
      catchError((error) => { 
        this.alert.alertNotification(error, 'error'); 
        throw error;
      })
    );
  }
}
