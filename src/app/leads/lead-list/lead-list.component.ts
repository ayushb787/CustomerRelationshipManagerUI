import { Component, OnInit } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { Router } from '@angular/router';
import { Lead } from '../../models/lead.model';
import { CommonModule } from '@angular/common';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { DatePipe } from '@angular/common'; // Import DatePipe
import { CustomerService } from '../../services/customer.service'; 

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  providers: [DatePipe],  // Add DatePipe here to resolve the dependency error
  templateUrl: './lead-list.component.html',
})
export class LeadListComponent implements OnInit {
  leads: Lead[] = [];
  loading = true;
  token: string | null = '';
  pageSize = 100;
  pageIndex = 1;
  total = 0;
  customers: any[] = [];
  users: any[] = [];

  constructor(
    private leadService: LeadService,
    private router: Router,
    private customerService: CustomerService, 
    private datePipe: DatePipe  // Inject DatePipe here
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.loadLeads();
      this.loadCustomers();
      this.loadUsers();
    } else {
      alert('Token is not available');
    }
  }

  loadLeads(): void {
    this.loading = true;
    if (this.token) {
      this.leadService.getLeads().subscribe(
        (data: any) => {
          this.leads = data.data; 
          this.loading = false;
        },
        (error) => {
          alert('Error fetching leads');
          console.log('Error fetching leads:', error);
          this.loading = false;
        }
      );
    }
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(
      (data: any) => {
        this.customers = data.data;
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

  loadUsers(): void {
    this.leadService.getUsers().subscribe(
      (data: any) => {
        this.users = data.data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  getCustomerName(customerId: number): string {
    const customer = this.customers.find(c => c.customerId === customerId);
    return customer ? customer.name : 'Unknown Customer';
  }

  getAssignedUsername(userId: number): string {
    const user = this.users.find(u => u.userId === userId);
    return user ? user.username : 'Unknown User';
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMM d, y, h:mm:ss a') || ''; 
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadLeads();
  }

  viewLead(leadId: number): void {
    this.router.navigate([`dashboard/leads/${leadId}`], { replaceUrl: true });
  }

  deleteLead(leadId: number): void {
    if (this.token) {
      if (confirm('Are you sure you want to delete this lead?')) {
        this.leadService.deleteLead(leadId).subscribe((response) => {
          alert('Customer deleted successfully');
          this.loadLeads();
        });
      }
    }
  }
}
