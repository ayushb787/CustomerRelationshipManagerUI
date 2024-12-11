import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexXAxis, ApexTitleSubtitle, ApexTooltip, NgApexchartsModule } from 'ng-apexcharts';
import { PerformanceService } from '../../services/performance.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LeadService } from '../../services/lead.service';

interface PerformanceMetric {
  metricId: number;
  userId: number;
  metricType: string;
  value: number;
  date: string;
  remarks: string;
}

interface GroupedData {
  userId: number;
  totalValue: number;
}

@Component({
  selector: 'app-performance-graphs',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, FormsModule],
  templateUrl: './performance-graphs.component.html',
  providers: [DatePipe],
  styleUrls: ['./performance-graphs.component.css'],
})
export class PerformanceGraphsComponent implements OnInit {
  public charts: {
    metricType: string;
    chartOptions: {
      series: ApexAxisChartSeries;
      chart: ApexChart;
      xaxis: ApexXAxis;
      dataLabels: ApexDataLabels;
      title: ApexTitleSubtitle;
      tooltip: ApexTooltip;
    };
  }[] = [];

  public users: { userId: number; username: string }[] = [];

  constructor(
    private performanceMetricsService: PerformanceService,
    private datePipe: DatePipe,
    private leadService: LeadService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadDataAndPrepareCharts();
  }

  loadUsers(): void {
    this.leadService.getUsers().subscribe(
      (data: any) => {
        console.log(data);
        this.users = data.data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  getAssignedUsername(userId: number): string {
    const user = this.users.find(u => u.userId === userId);
    return user ? user.username : 'Unknown User';
  }

  loadDataAndPrepareCharts(): void {
    this.performanceMetricsService.getPerformances().subscribe(
      (response: { success: boolean; data: PerformanceMetric[]; message: string }) => {
        if (response.success) {
          const metrics = response.data;

          const groupedByMetric = this.groupByMetricTypeAndDate(metrics);

          this.charts = Object.keys(groupedByMetric).map((metricType) => {
            const groupedData = groupedByMetric[metricType];

            const series = this.prepareChartSeries(groupedData);

            return {
              metricType,
              chartOptions: {
                series: series,
                chart: {
                  type: 'bar',
                  height: 350,
                  stacked: true,
                  toolbar: {
                    show: true,
                  },
                },
                xaxis: {
                  categories: this.getUniqueDates(groupedData),
                },
                dataLabels: {
                  enabled: true,
                },
                title: {
                  text: `Performance Over Time`,
                  align: 'center',
                },
                tooltip: {
                  shared: true,
                  intersect: false,
                  y: {
                    formatter: (val: number) => val.toFixed(0),
                  },
                  custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
                    const username = w.config.series[seriesIndex].name;
                    return `<div><strong>${username}</strong>: ${w.config.series[seriesIndex].data[dataPointIndex]}</div>`;
                  },
                },
              },
            };
          });
        } else {
          console.error('Failed to load performance data:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching performance data:', error);
      }
    );
  }

  private groupByMetricTypeAndDate(metrics: PerformanceMetric[]): Record<string, Record<string, GroupedData[]>> {
    const grouped: Record<string, Record<string, GroupedData[]>> = {};

    metrics.forEach((metric) => {
      const { metricType, date, userId, value } = metric;

      if (!grouped[metricType]) {
        grouped[metricType] = {};
      }

      if (!grouped[metricType][date]) {
        grouped[metricType][date] = [];
      }

      const existing = grouped[metricType][date].find((data) => data.userId === userId);

      if (existing) {
        existing.totalValue += value;
      } else {
        grouped[metricType][date].push({
          userId,
          totalValue: value,
        });
      }
    });

    return grouped;
  }

  private prepareChartSeries(groupedData: Record<string, GroupedData[]>): ApexAxisChartSeries {
    const series = this.users.map((user) => {
      const username = user.username;  
      return {
        name: username,  
        data: Object.keys(groupedData).map((date) => {
          const userData = groupedData[date].find((data) => data.userId === user.userId);
          return userData ? userData.totalValue : 0;
        }),
      };
    });

    return series;
  }

  private getUniqueDates(groupedData: Record<string, GroupedData[]>): string[] {
    const dates = Array.from(new Set(Object.keys(groupedData)));
    return dates
      .map((date) => this.datePipe.transform(date, 'MMM dd, y') || '')
      .filter((date) => date);
  }
}
