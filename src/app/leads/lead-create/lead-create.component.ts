import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeadService } from '../../services/lead.service';
import { CustomerService } from '../../services/customer.service';   
import { Lead } from '../../models/lead.model';
import { Customer } from '../../models/customer.model';  
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AlertNotificationService } from '../../services/alert-notification.service';

@Component({
  selector: 'app-lead-create',
  standalone: true,
  imports: [FormsModule, CommonModule, NzSpinModule],
  templateUrl: './lead-create.component.html',
})
export class LeadCreateComponent implements OnInit {
  lead: Lead = {
    leadId: 0,
    customerId: 0,
    assignedTo: 0,
    status: '',
    pipelineStage: '',
    dateCreated: '',
    lastUpdated: '',
  };

  customers: Customer[] = []; 
  users: any[] = [];
  isLoading = false;

  constructor(
    private leadService: LeadService,
    private customerService: CustomerService,  
    private router: Router,
    private alert: AlertNotificationService,
  ) {}

  ngOnInit(): void { 
    this.isLoading = true;
    this.customerService.getCustomers().subscribe(
      (data) => {
        this.customers = data.data;  
      },
      (error) => { 
        this.alert.alertNotification('Error fetching customers', 'error'); 
      }
    );
    this.leadService.getUsers().subscribe((response) => { 
        this.users = response.data; 
    },
    (error) => {
      this.isLoading = false; 
      this.alert.alertNotification('Error fetching users', 'error'); 
    }
  );
  this.isLoading = false;
  }

  createLead(): void {
    this.isLoading = true;
    this.leadService.createLead(this.lead).subscribe(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard/leads'], {replaceUrl: true});
    });
  }
}
