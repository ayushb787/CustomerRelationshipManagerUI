import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { environment } from '../../services/environment';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { AlertNotificationService } from '../../services/alert-notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    HttpClientModule,
    NzCardComponent,
    NzSpinComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
    private alert: AlertNotificationService,) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.loginForm.valid) { 
      this.http.post(`${environment.baseUrl}/api/auth/login`, this.loginForm.value).subscribe({
        next: (response: any) => {
          if (response.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('role', response.data.role);
  
            this.isLoading = false;
            this.router.navigate(['/dashboard'], {replaceUrl: true});
          } else {
            this.isLoading = false; 
            this.alert.alertNotification('Login failed' + response.data.message, 'error');
          }
        },
        error: (err) => {
          this.isLoading = false; 
          this.alert.alertNotification('Login failed' + err.error.message, 'error');
        }
      });
    }
  }
  navigateToSignup(): void {
    this.router.navigate(['/signup'], {replaceUrl: true});
  }
  
}
