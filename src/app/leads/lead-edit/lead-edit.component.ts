import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadService } from '../../services/lead.service';
import { Lead } from '../../models/lead.model';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-lead-edit',
  standalone: true,
  imports: [FormsModule, CommonModule, NzSpinModule],
  templateUrl: './lead-edit.component.html',
})
export class LeadEditComponent implements OnInit {
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
    private route: ActivatedRoute,
    private leadService: LeadService,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const leadId = Number(this.route.snapshot.paramMap.get('id'));
    if (leadId) {
      this.leadService.getLeadById(leadId).subscribe(
        (response: any) => {
          if (response) {
            this.lead = response.data;

           
          } else {
            this.isLoading = false;
            alert('Error fetching lead data');
          }
        },
        (error) => {
          this.isLoading = false;
          alert("Error fetching lead data");
          console.error('Error fetching lead data:', error);
        }
      );
    }

    // Fetch customers for the dropdown
    this.customerService.getCustomers().subscribe(
      (data: any) => {
        this.customers = data.data; // Assuming customers data structure has `data`
      },
      (error) => {
        this.isLoading = false;
        alert("Error fetching customers");
        console.error('Error fetching customers:', error);
      }
    );
 
    this.leadService.getUsers().subscribe(
      (response: any) => {
        this.users = response.data;  
         
        if (this.lead.assignedTo) {
          const assignedUser = this.users.find(user => user.userId == this.lead.assignedTo);
          console.log(assignedUser);
          if (assignedUser) {
            this.lead.assignedTo = assignedUser.userId;  
          }
        }
      },
      (error) => {
        this.isLoading = false;
        alert("Error fetching users");
        console.error('Error fetching users:', error);
      }
    );
    this.isLoading = false;
  }

  updateLead(): void {
    this.isLoading = true;
    if (this.lead) {
      this.leadService.updateLead(this.lead.leadId, this.lead).subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/leads'], {replaceUrl: true});
        },
        (error) => {
          this.isLoading = false;
          alert("Error updating lead");
          console.error('Error updating lead:', error);
        }
      );
    }
  }
}
