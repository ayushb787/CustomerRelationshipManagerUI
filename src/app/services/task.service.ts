import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { environment } from './environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.baseUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getUserId(): string | null {
    return localStorage.getItem('userId');
  }
  
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  private validateToken(): boolean {
    const token = this.getToken();
    return token !== null; 
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

    alert(alertMessage); 
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


  getTasksBySalesperson( ): Observable<Task[]> {
    const salespersonId = this.getUserId();
    const headers = this.getAuthHeaders();
    return this.http.get<Task[]>(`${this.apiUrl}/salesperson/${salespersonId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getPaginatedTasksBySalesperson(page: number, pageSize: number): Observable<Task[]> {
    const headers = this.getAuthHeaders();
    const salespersonId = this.getUserId();
    return this.http.get<Task[]>(`${this.apiUrl}/salesperson/${salespersonId}?page=${page}&size=${pageSize}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getTaskById(taskId: string): Observable<Task> {
    const headers = this.getAuthHeaders();
    return this.http.get<Task>(`${this.apiUrl}/${taskId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getAllTasks(): Observable<Task[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Task[]>(`${this.apiUrl}/all`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getAllPaginatedTasks(page: number, pageSize: number): Observable<Task[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Task[]>(`${this.apiUrl}/all?page=${page}&size=${pageSize}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createTask(task: Partial<Task>): Observable<Task> {
    console.log(task);
    const headers = this.getAuthHeaders();
    return this.http.post<Task>(`${this.apiUrl}/create`, task, { headers }).pipe(
      catchError(this.handleError)
    );
  }


  updateTask(taskId: string, task: Task): Observable<Task> {
    const headers = this.getAuthHeaders();
  
    return this.http.put<Task>(`${this.apiUrl}/${taskId}/update`, task, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteTask(taskId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${taskId}/delete`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
}
