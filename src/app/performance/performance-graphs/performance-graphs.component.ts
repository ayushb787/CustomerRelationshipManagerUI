import { Component, OnInit } from '@angular/core';
import { PerformanceService } from '../../services/performance.service';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartsModule } from 'ng-charts'; // Ensure this module is compatible with standalone components
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective  } from 'ng2-charts';
import { PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { AlertNotificationService } from '../../services/alert-notification.service';


@Component({
  selector: 'app-performance-graphs', 
  standalone: true,
  imports:[FormsModule, CommonModule],
  templateUrl: './performance-graphs.component.html',
})
export class PerformanceGraphsComponent implements OnInit {
  userWiseChartData: ChartData<'bar'> = { datasets: [] };
  dateWiseChartData: ChartData<'line'> = { datasets: [] };
  metricTypeWiseChartData: ChartData<'pie'> = { datasets: [] };

  userWiseChartLabels: string[] = [];
  dateWiseChartLabels: string[] = [];
  metricTypeWiseChartLabels: string[] = [];

  userWiseChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'User',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Performance Value',
        },
      },
    },
  };

  dateWiseChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Performance Value',
        },
      },
    },
  };

  metricTypeWiseChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} units`,
        },
      },
    },
  };

  constructor(private performanceMetricsService: PerformanceService,
    private alert: AlertNotificationService,) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.loadUserWiseData();
    this.loadDateWiseData();
    this.loadMetricTypeWiseData();
  }

  loadUserWiseData(): void {
    this.performanceMetricsService.getPerformances().subscribe(
      (data) => { 
        const groupedByUser = this.groupBy(data.data, 'userId');
        this.userWiseChartLabels = Object.keys(groupedByUser);
        this.userWiseChartData = {
          labels: this.userWiseChartLabels,
          datasets: [
            {
              data: this.userWiseChartLabels.map(
                (userId) => this.aggregatePerformance(groupedByUser[userId])
              ),
              label: 'Performance by User',
              backgroundColor: '#6394f9',
            },
          ],
        }; 
      },
      (error) => { 
        this.alert.alertNotification('Error loading user-wise data', 'error'); 
      }
    );
  }
  

  loadDateWiseData(): void {
    this.performanceMetricsService.getPerformances().subscribe(
      (data) => { 
        const groupedByDate = this.groupBy(data.data, 'date');
        this.dateWiseChartLabels = Object.keys(groupedByDate);
        this.dateWiseChartData = {
          labels: this.dateWiseChartLabels,
          datasets: [
            {
              data: this.dateWiseChartLabels.map(
                (date) => this.aggregatePerformance(groupedByDate[date])
              ),
              label: 'Performance by Date',
              borderColor: '#62daaa',
              backgroundColor: 'rgba(98, 218, 170, 0.2)',
              fill: true,
            },
          ],
        };
      },
      (error) => { 
        this.alert.alertNotification('Error loading date-wise data', 'error'); 
      }
    );
  }

  loadMetricTypeWiseData(): void {
    this.performanceMetricsService.getPerformances().subscribe(
      (data) => {
        const groupedByMetricType = this.groupBy(data.data, 'metricType');
        this.metricTypeWiseChartLabels = Object.keys(groupedByMetricType);
        this.metricTypeWiseChartData = {
          labels: this.metricTypeWiseChartLabels,
          datasets: [
            {
              data: this.metricTypeWiseChartLabels.map(
                (metricType) => this.aggregatePerformance(groupedByMetricType[metricType])
              ),
              label: 'Metric Type Performance',
              backgroundColor: ['#6394f9', '#62daaa', '#ff6347', '#ffcc00', '#90ee90'],
            },
          ],
        };
      },
      (error) => { 
        this.alert.alertNotification('Error loading metric-type wise data', 'error'); 
      }
    );
  }

  groupBy(array: any[], key: string): { [key: string]: any[] } {
    return array.reduce((result, currentValue) => {
      const groupKey = currentValue[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentValue);
      return result;
    }, {});
  }

  aggregatePerformance(entries: any[]): number {
    return entries.reduce((total, entry) => total + entry.value, 0);
  }
}
