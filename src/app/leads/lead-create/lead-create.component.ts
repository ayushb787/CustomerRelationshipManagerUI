import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeadService } from '../../services/lead.service';
import { CustomerService } from '../../services/customer.service';   
import { Lead } from '../../models/lead.model';
import { Customer } from '../../models/customer.model';  
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-lead-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './lead-create.component.html',
})
export class LeadCreateComponent implements OnInit {
  lead: Lead = {
    leadId: 0,
    customerId: 0,
    assignedTo: 0,
    status: 'New',
    pipelineStage: 'Prospect',
    dateCreated: '',
    lastUpdated: '',
  };

  customers: Customer[] = []; 
  users: any[] = [];

  constructor(
    private leadService: LeadService,
    private customerService: CustomerService,  
    private router: Router
  ) {}

  ngOnInit(): void { 
    this.customerService.getCustomers().subscribe(
      (data) => {
        this.customers = data.data;  
      },
      (error) => {
        alert("Error fetching customers");
        console.error('Error fetching customers:', error);
      }
    );
    this.leadService.getUsers().subscribe((response) => { 
        this.users = response.data; 
    },
    (error) => {
      alert("Error fetching users");
      console.error('Error fetching users:', error);
    }
  );
  }

  createLead(): void {
    this.leadService.createLead(this.lead).subscribe(() => {
      this.router.navigate(['/dashboard/leads']);
    });
  }
}
