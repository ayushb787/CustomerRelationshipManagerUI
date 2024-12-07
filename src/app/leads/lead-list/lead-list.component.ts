import { Component, OnInit } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { Router } from '@angular/router';
import { Lead } from '../../models/lead.model';
import { CommonModule } from '@angular/common';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';


@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  templateUrl: './lead-list.component.html',
})
export class LeadListComponent implements OnInit {
  leads: Lead[] = [];
  loading = true;
  token: string | null = '';
  pageSize = 100;
  pageIndex = 1;
  total = 0;

  constructor(private leadService: LeadService, private router: Router) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.loadLeads();
    } else {
      alert('Token is not available');
    }
  }

  loadLeads(): void {
    this.loading = true;
    if (this.token) {
      this.leadService.getLeads().subscribe(
        (data: any) => {
          this.leads =data.data; 
          this.loading = false;
        },
        (error) => {
          alert('Error fetching leads');
          console.log('Error fetching leads:' ,error);
          this.loading = false;
        },
      );
    }
  }


  viewLead(leadId: number): void {
    this.router.navigate([`dashboard/leads/${leadId}`], {replaceUrl: true});
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

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    // Reload leads based on the current page
    this.loadLeads();
  }

}
