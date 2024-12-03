import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  // Get all customers
  getCustomers(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.apiUrl, { headers });
  }

  // Get a specific customer by ID
  getCustomerById(id: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  // Create a new customer
  createCustomer(customer: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, customer, { headers });
  }

  // Update an existing customer by ID
  updateCustomer(id: string, customer: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/${id}`, customer, { headers });
  }

  // Delete a customer by ID
  deleteCustomer(id: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
