import { Component, OnInit } from '@angular/core';
import { PerformanceService } from '../../services/performance.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-performance-metrics-list',
  standalone: true,
  imports: [NzTableModule, NzButtonModule, FormsModule, CommonModule],
  templateUrl: './performance-list.component.html',
})
export class PerformanceMetricsListComponent implements OnInit {
  metrics: any[] = [];
  loading = false;

  constructor(
    private performanceMetricsService: PerformanceService,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.loading = true;
    this.performanceMetricsService.getPerformances().subscribe(
      (data) => {
        this.metrics = data.data;
        this.loading = false;
      },
      (error) => {
        this.message.error('Failed to load metrics');
        this.loading = false;
      }
    );
  }

  editPerformance(id: number): void { 
    this.router.navigate([`dashboard/performance/${id}`]);
  }
}
