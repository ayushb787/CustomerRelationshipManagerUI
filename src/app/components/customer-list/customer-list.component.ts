import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customers: any[] = [];
  token: string | null = '';

  constructor(
    private customerService: CustomerService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');  
    if (this.token) {
      this.getCustomers();
    } else {
      console.error('Token is not available');
    }
  }

  getCustomers(): void {
    if (this.token) {
      this.customerService.getCustomers().subscribe(
        (response: any) => {
          this.customers = response.data || []; 
        },
        (error) => {
          console.error('Error fetching customers', error);
        }
      );
    }
  }
  

  viewCustomer(id: string): void {
    this.router.navigate([`/customer/${id}`]);
  }

  deleteCustomer(id: string): void {
    if (this.token) {
      this.customerService.deleteCustomer(id).subscribe(
        (response) => {
          console.log('Customer deleted successfully');
          this.getCustomers();  
        },
        (error) => {
          console.error('Error deleting customer', error);
        }
      );
    }
  }
}
