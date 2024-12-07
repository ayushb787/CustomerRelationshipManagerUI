import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NzSpinModule } from 'ng-zorro-antd/spin';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.token = localStorage.getItem('token');  // Retrieve the token from localStorage
    if (this.customerId && this.token) {
      this.getCustomerById();
    } else {
      this.isLoading = false;
      console.error('Missing customer ID or token');
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
        console.error('Error fetching customer details', error);
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
        console.error('Error updating customer', error);
      });
    }
    this.isLoading = false;
  }
}
