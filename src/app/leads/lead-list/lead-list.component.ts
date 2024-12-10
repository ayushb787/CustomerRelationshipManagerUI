import { Component, OnInit } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { Router } from '@angular/router';
import { Lead } from '../../models/lead.model';
import { CommonModule } from '@angular/common';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { DatePipe } from '@angular/common'; // Import DatePipe
import { CustomerService } from '../../services/customer.service'; 
import { AlertNotificationService } from '../../services/alert-notification.service';

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
  pageSize = 10;
  pageIndex = 0;
  total = 0;
  customers: any[] = [];
  users: any[] = [];

  constructor(
    private leadService: LeadService,
    private router: Router,
    private customerService: CustomerService, 
    private datePipe: DatePipe   ,
    private alert: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.getPaginatedLeads();
      this.loadCustomers();
      this.loadUsers();
    } else { 
      this.alert.alertNotification('Token is not available', 'error');
    }
  }

  //old function 
  loadLeads(): void {
    this.loading = true;
    if (this.token) {
      this.leadService.getLeads().subscribe(
        (data: any) => {
          this.leads = data.data; 
          this.loading = false;
        },
        (error) => { 
          this.alert.alertNotification('Error fetching leads', 'error'); 
          this.loading = false;
        }
      );
    }
  }
//new function with pagination
  getPaginatedLeads(): void {
    this.loading = true;
    if (this.token) {
      this.leadService.getPaginatedLeads(this.pageIndex, this.pageSize).subscribe(
        (response: any) => {  
          this.leads = response.data.content || [];   
          this.total = response.data.page.totalPages || 0;  
          this.loading = false;
        },
        (error) => { 
          this.alert.alertNotification('Error fetching paginated leads', 'error'); 
          this.loading = false;
        }
      );
    }
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(
      (response: any) => {
        this.customers = response.data.content;
      },
      (error) => { 
        this.alert.alertNotification('Error fetching customers', 'error');
      }
    );
  }

  loadUsers(): void {
    this.leadService.getUsers().subscribe(
      (data: any) => {
        this.users = data.data;
      },
      (error) => {
        this.alert.alertNotification('Error fetching users', 'error'); 
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
          this.alert.alertNotification('Customer deleted successfully', 'success');
          this.loadLeads();
        });
      }
    }
  }

  onPreviousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.getPaginatedLeads();
    }
  }
  
  onNextPage(): void { 
    const maxPage = Math.ceil(this.total / this.pageSize);
    if (this.pageIndex < maxPage-1) {
      this.pageIndex++;
      this.getPaginatedLeads();
    }
  }
}
