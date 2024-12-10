import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = `${environment.baseUrl}/api/customers`;
  private communicationApiUrl = `${environment.baseUrl}/api/communication/notify-customer`;

  constructor(private http: HttpClient) {}

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

    alert(alertMessage); //New Custom Popups
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

  getCustomers(): Observable<any> {
const headers = this.getAuthHeaders();
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getPaginatedCustomers(page: number, pageSize: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${pageSize}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  

  getCustomerById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createCustomer(customer: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, customer, { headers }).pipe(
      catchError(this.handleError) 
    );
  }

  updateCustomer(id: string, customer: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/${id}`, customer, { headers }).pipe(
      catchError(this.handleError) 
    );
  }

  deleteCustomer(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError) 
    );
  }

  sendEmail(customerId: string, payload: any): Observable<any> {
    let headers = this.getAuthHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    
    return this.http.post(
      `${this.communicationApiUrl}/${customerId}`,
      `subject=${payload.subject}&message=${payload.message}`,
      { headers }
    );
  }
  
}
