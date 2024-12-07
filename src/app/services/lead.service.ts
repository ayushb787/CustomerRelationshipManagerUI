import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Lead } from '../models/lead.model';

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  private apiUrl = `http://localhost:8080/api/leads`;

  constructor(private http: HttpClient) {}

  // Helper method to get the token from localStorage
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Validate the token
  private validateToken(): boolean {
    const token = this.getToken();
    return token !== null; // Add expiration checks here if needed
  }

  // Handle errors and notify the user
  private handleError(error: any): Observable<never> {
    const errorMessage = error.error.message || 'An error occurred';
    console.error(`Error: ${errorMessage}`, error);

    alert(errorMessage); // Replace with a toast notification system
    return throwError(() => new Error(errorMessage));
  }

  // Helper method to get authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      alert('Authentication required. Redirecting to login.');
      // Redirect logic here (optional)
      throw new Error('Authentication token is missing');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Fetch all leads
  getLeads(): Observable<Lead[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Lead[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch a specific lead by ID
  getLeadById(leadId: number): Observable<Lead> {
    const headers = this.getAuthHeaders();
    return this.http.get<Lead>(`${this.apiUrl}/${leadId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Create a new lead
  createLead(lead: Partial<Lead>): Observable<Lead> {
    const headers = this.getAuthHeaders();
    return this.http.post<Lead>(this.apiUrl, lead, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing lead
  updateLead(leadId: number, lead: Partial<Lead>): Observable<Lead> {
    const headers = this.getAuthHeaders();
    return this.http.put<Lead>(`${this.apiUrl}/${leadId}`, lead, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a lead
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
    return this.http.get<any>('http://localhost:8080/api/leads/users?role=Salesperson', { headers }).pipe(
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }
}
