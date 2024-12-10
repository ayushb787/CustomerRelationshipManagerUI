import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from '../../services/lead.service';
import { PerformanceService } from '../../services/performance.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertNotificationService } from '../../services/alert-notification.service';

@Component({
  selector: 'app-performance-metrics-update',
  standalone: true,
  imports: [FormsModule, CommonModule, NzSpinModule],
  templateUrl: './performance-edit.component.html',
})
export class PerformanceMetricsUpdateComponent implements OnInit {
  performance = {
    userId: 0,
    metricType: '',
    value: 0,
    date: '',
    remarks: ''
  };

  users: any[] = [];
  isLoading = false;
  metricId!: number;

  constructor(
    private performanceMetricsService: PerformanceService,
    private message: NzMessageService,
    private userService: LeadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alert: AlertNotificationService,
  ) {}

  ngOnInit(): void {
    this.metricId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.loadPerformanceMetric();
    this.getUsers();
  }

  loadPerformanceMetric(): void {
    this.isLoading = true;
    this.performanceMetricsService.getPerformanceById(this.metricId).subscribe(
      (data) => {
        this.performance = data;
        this.isLoading = false;
      },
      (error) => { 
        this.isLoading = false; 
        this.alert.alertNotification('Failed to load performance metric', 'error');
        this.router.navigate(['/performance'], { replaceUrl: true });
      }
    );
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

  updatePerformanceMetric(): void {
    this.isLoading = true;
    this.performanceMetricsService.updatePerformance(this.metricId, this.performance).subscribe(
      () => {
        this.isLoading = false; 
        this.alert.alertNotification('Performance metric updated successfully', 'success'); 
        this.router.navigate(['/performance'], { replaceUrl: true });
      },
      (error) => {
        this.isLoading = false; 
        this.alert.alertNotification('Failed to update performance metric', 'error'); 
      }
    );
  }
}
