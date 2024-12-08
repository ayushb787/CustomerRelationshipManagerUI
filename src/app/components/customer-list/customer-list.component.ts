import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customers: any[] = [];
  filteredCustomers: any[] = [];
  token: string | null = '';
  pageSize = 100;
  pageIndex = 1;
  total = 0;
  loading = true;

  categories = [
    { name: 'Inactive', selected: false },
    { name: 'Potential', selected: false },
    { name: 'Active', selected: false },
  ];

  preferences = [
    { name: 'Email', selected: false },
    { name: 'Phone', selected: false },
    { name: 'Address', selected: false },
  ];

  filterCategories: any[] = [];
  filterPreferences: any[] = [];

  constructor(
    private customerService: CustomerService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');  
    if (this.token) {
      this.getCustomers();
    } else {
      alert('Token is not available');
    }
  }

  getCustomers(): void {
    this.loading = true;
    if (this.token) {
      this.customerService.getCustomers().subscribe(
        (response: any) => {
          this.customers = response.data || [];
          this.filteredCustomers = [...this.customers];  
          this.loading = false;
        },
        (error) => {
          alert('Error fetching customers');
          console.error('Error fetching customers', error);
          this.loading = false;
        }
      );
    }
  }

  viewCustomer(id: string): void {
    this.router.navigate([`dashboard/customers/${id}`], {replaceUrl: true});
  }

  deleteCustomer(id: string): void {
    if (this.token) {
      if (confirm('Are you sure you want to delete this lead?')){
      this.customerService.deleteCustomer(id).subscribe(
        (response) => {
          alert('Customer deleted successfully');
          this.getCustomers();  
        },
        (error) => {
          console.error('Error deleting customer', error);
        }
      );
    }
    }
  }

  applyFilters(): void {
    this.filteredCustomers = this.customers.filter(customer => {
      const categoryMatch = this.categories.some(category => category.selected && category.name === customer.category);
      const preferenceMatch = this.preferences.some(preference => preference.selected && preference.name === customer.preferences);

      return (categoryMatch || this.categories.every(category => !category.selected)) &&
             (preferenceMatch || this.preferences.every(preference => !preference.selected));
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
  }

  sortName = (a: any, b: any): number => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  };


  sendEmail(customerId: string): void {
    this.router.navigate([`dashboard/customers/email/${customerId}`], {replaceUrl:true});
  }
}
