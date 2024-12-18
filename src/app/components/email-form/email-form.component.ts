import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';  
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { AlertNotificationService } from '../../services/alert-notification.service';

@Component({
  selector: 'app-email-form',
  standalone: true,
  imports: [
    NzFormModule, 
    FormsModule, 
    NzButtonModule, 
    NzInputModule,
    CommonModule,
    NzSpinComponent
  ],
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css'],
})
export class EmailFormComponent implements OnInit {
  customerId: string = '';
  subject: string = '';
  message: string = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private alert: AlertNotificationService,
  ) {}

  ngOnInit(): void { 
    this.customerId = this.route.snapshot.paramMap.get('id') || '';
  }

  onSubmit(): void {
    this.isLoading = true;
    const payload = {
      subject: this.subject,
      message: this.message,
    };

    this.customerService.sendEmail(this.customerId, payload).subscribe(
      (response) => { 
        this.alert.alertNotification('Email sent successfully', 'success');
        this.router.navigate(['/dashboard/customers'], {replaceUrl: true});
        this.isLoading = false;
      },
      (error) => { 
        this.alert.alertNotification('Error sending email', 'error');
        this.isLoading = false;
      }
    );
  }
}
