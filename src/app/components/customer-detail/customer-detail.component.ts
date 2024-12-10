import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AlertNotificationService } from '../../services/alert-notification.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSpinModule],
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  customer: any = {};
  customerId: string | null = null;
  token: string | null = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private alert: AlertNotificationService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.token = localStorage.getItem('token'); 
    if (this.customerId && this.token) {
      this.getCustomerById();
    } else {
      this.isLoading = false; 
      this.alert.alertNotification('Missing customer ID or token', 'error');
    }
    this.isLoading = false;
  }

  getCustomerById(): void {
    this.isLoading = true;
    if (this.customerId && this.token) {
      this.customerService.getCustomerById(this.customerId).subscribe((response) => {
        this.customer = response.data;
      }, error => {
        this.isLoading = false; 
        this.alert.alertNotification('Error fetching customer details', 'error');
      });
    }
    this.isLoading = false;
  }

  updateCustomer(): void {
    this.isLoading = true;
    if (this.customerId && this.token) {
      this.customerService.updateCustomer(this.customerId, this.customer).subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/customers'], {replaceUrl: true});
      }, error => {
        this.isLoading = false; 
        this.alert.alertNotification('Error updating customer', 'error');
      });
    }
    this.isLoading = false;
  }
}
