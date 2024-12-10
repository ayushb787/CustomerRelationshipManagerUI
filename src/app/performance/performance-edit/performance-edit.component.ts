import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from '../../services/lead.service';
import { PerformanceService } from '../../services/performance.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    private activatedRoute: ActivatedRoute
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
        console.error('Error loading performance metric', error);
        this.isLoading = false;
        this.message.error('Failed to load performance metric');
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
        console.error('Error fetching users', error);
        this.isLoading = false;
      }
    );
  }

  updatePerformanceMetric(): void {
    this.isLoading = true;
    this.performanceMetricsService.updatePerformance(this.metricId, this.performance).subscribe(
      () => {
        this.isLoading = false;
        this.message.success('Performance metric updated successfully!');
        this.router.navigate(['/performance'], { replaceUrl: true });
      },
      (error) => {
        this.isLoading = false;
        this.message.error('Failed to update performance metric');
        console.error('Error updating performance metric', error);
      }
    );
  }
}
