import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) {}

  // Helper method to get the token from localStorage
  private getToken(): string | null {
    console.log(localStorage.getItem('token'));
    return localStorage.getItem('token');
  }

  // Handle errors and show alert
  private handleError(error: any): Observable<never> {
    console.log(error);
    
    // Extract message and data from the error response
    const errorMessage = error.error.message || 'An error occurred';
    const errorData = error.error.data || {};
  
    // Display the message and data in the alert
    let alertMessage = errorMessage;
  
    // If there is error data, display each field's error message
    if (Object.keys(errorData).length > 0) {
      alertMessage += '\n' + Object.entries(errorData)
        .map(([field, message]) => `${message}`)
        .join('\n');
    }
  
    alert(alertMessage); // Show error message and data in alert box
    return throwError(() => new Error(errorMessage));
  }
  

  // Get all customers
  getCustomers(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError) // Catch error and handle it
    );
  }

  // Get a specific customer by ID
  getCustomerById(id: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError) // Catch error and handle it
    );
  }

  // Create a new customer
  createCustomer(customer: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, customer, { headers }).pipe(
      catchError(this.handleError) // Catch error and handle it
    );
  }

  // Update an existing customer by ID
  updateCustomer(id: string, customer: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/${id}`, customer, { headers }).pipe(
      catchError(this.handleError) // Catch error and handle it
    );
  }

  // Delete a customer by ID
  deleteCustomer(id: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError) // Catch error and handle it
    );
  }
}
