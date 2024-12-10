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
  pageSize = 10;
  pageIndex = 0;
  total = 0;
  maxPage = 0;
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
      this.getPaginatedCustomers();
    } else {
      alert('Token is not available');
    }
  }
  //old function 
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

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.getPaginatedCustomers();
  }
  //new function with pagination
  getPaginatedCustomers(): void {
    this.loading = true;
    if (this.token) {
      this.customerService.getPaginatedCustomers(this.pageIndex, this.pageSize).subscribe(
        (response: any) => {
          console.log( response);
          this.customers = response.data.content || []; 
          this.filteredCustomers = [...this.customers]; 
          this.total = response.data.page.totalPages || 0; 
          console.log(this.customers);
          this.loading = false;
        },
        (error) => {
          alert('Error fetching paginated customers');
          console.error('Error fetching paginated customers', error);
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
          // this.getCustomers();  
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


  onPreviousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.getPaginatedCustomers();
    }
  }
  
  onNextPage(): void { 
    const maxPage = Math.ceil(this.total / this.pageSize);
    if (this.pageIndex < maxPage-1) {
      this.pageIndex++;
      this.getPaginatedCustomers();
    }
  }
  
}
