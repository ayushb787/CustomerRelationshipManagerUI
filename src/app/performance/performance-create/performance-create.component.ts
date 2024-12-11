import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeadService } from '../../services/lead.service';
import { PerformanceService } from '../../services/performance.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertNotificationService } from '../../services/alert-notification.service';

@Component({
  selector: 'app-performance-metrics-create',
  standalone: true,
  imports: [FormsModule, CommonModule, NzSpinModule],
  templateUrl: './performance-create.component.html',
})
export class PerformanceMetricsCreateComponent implements OnInit {
  performance = {
    userId: 0,
    metricType: '',
    value: 0,
    date: '',
    remarks: ''
  };

  users: any[] = [];
  isLoading = false;

  constructor(
    private performanceMetricsService: PerformanceService,
    private message: NzMessageService,
    private userService: LeadService,
    private router: Router,
    private alert: AlertNotificationService,
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data.data;
        this.isLoading = false;
      },
      (error) => { 
        this.alert.alertNotification('Error fetching users', 'error'); 
        this.isLoading = false;
      }
    );
  }

  createPerformanceMetric(): void {
    this.isLoading = true;
    this.performanceMetricsService.createPerformance(this.performance).subscribe(
      () => {
        this.isLoading = false; 
        this.alert.alertNotification('Performance metric added successfully', 'success'); 
        this.router.navigate(['/dashboard/performance'], { replaceUrl: true });
      },
      (error) => {
        this.isLoading = false; 
        this.alert.alertNotification('Error adding performance metric', 'error'); 
      }
    );
  }
}
