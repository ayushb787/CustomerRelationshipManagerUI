import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  customer: any = {};
  customerId: string | null = null;
  token: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.token = localStorage.getItem('token');  // Retrieve the token from localStorage
    if (this.customerId && this.token) {
      this.getCustomerById();
    } else {
      console.error('Missing customer ID or token');
    }
  }

  getCustomerById(): void {
    if (this.customerId && this.token) {
      this.customerService.getCustomerById(this.customerId).subscribe((response) => {
        this.customer = response.data;
      }, error => {
        console.error('Error fetching customer details', error);
      });
    }
  }

  updateCustomer(): void {
    if (this.customerId && this.token) {
      this.customerService.updateCustomer(this.customerId, this.customer).subscribe(() => {
        this.router.navigate(['/dashboard/customers']);
      }, error => {
        console.error('Error updating customer', error);
      });
    }
  }
}
