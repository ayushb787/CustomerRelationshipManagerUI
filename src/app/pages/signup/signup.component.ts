import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { environment } from '../../services/environment';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { AlertNotificationService } from '../../services/alert-notification.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    HttpClientModule,
    NzCardModule,
    NzSpinComponent
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
    private alert: AlertNotificationService,) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.signupForm.valid) {
      const apiUrl = `${environment.baseUrl}/api/auth/signup`;
      this.http.post(apiUrl, this.signupForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/login'], {replaceUrl: true})
        },
        error: (err) => { 
          this.isLoading = false; 
          this.alert.alertNotification('Signup failed' + err.error.message, 'error');
        }
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login'], {replaceUrl: true});
  }
  
}
