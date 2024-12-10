import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Task } from '../../models/task.model';
import { Router } from '@angular/router';
import { LeadService } from '../../services/lead.service';
import { DatePipe } from '@angular/common';
import { AlertNotificationService } from '../../services/alert-notification.service';
@Component({
  selector: 'app-task-all-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NzSpinModule, NzTableModule],
  providers: [DatePipe],
  templateUrl: './task-all-list.component.html',
  styleUrls: ['./task-all-list.component.css']
})
export class TaskAllListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  token: string | null = '';
  total = 0;
  pageSize = 5;
  pageIndex = 0;
  userId = '';
  users: any[] = [];

  constructor(private taskService: TaskService, private router: Router, private leadService: LeadService,
    private datePipe: DatePipe,
    private alert: AlertNotificationService,) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.getAllPaginatedTasks();
      this.loadUsers();
    } else { 
      this.alert.alertNotification('Token is not available', 'error');
    }
  }

  getAllPaginatedTasks(): void {
    this.loading = true;
    if (this.token) {
      this.taskService.getAllPaginatedTasks(this.pageIndex, this.pageSize).subscribe(
        (response: any) => {
          this.tasks = response.data.content || [];
          this.total = response.data.page.totalPages || 0; 
          this.loading = false;
        },
        (error) => { 
          this.alert.alertNotification('Error fetching paginated tasks', 'error'); 
          this.loading = false;
        }
      );
    }
  }


  loadUsers(): void {
    this.leadService.getUsers().subscribe(
      (data: any) => {
        this.users = data.data;
      },
      (error) => { 
        this.alert.alertNotification('Error fetching users', 'error'); 
      }
    );
  }

  getAssignedUsername(userId: number): string {
    const user = this.users.find(u => u.userId === userId);
    return user ? user.username : 'Unknown User';
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMM d, y, h:mm:ss a') || '';
  }

  editTask(taskId: number): void {
    this.router.navigate([`dashboard/tasks/${taskId}`], { replaceUrl: true });
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe(
        () => {
          this.getAllPaginatedTasks();
        },
        (error) => { 
          this.alert.alertNotification('Error deleting task', 'error'); 
        }
      );
    }
  }

  onPreviousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.getAllPaginatedTasks();
    }
  }

  onNextPage(): void {
    const maxPage = Math.ceil(this.total / this.pageSize);
    if (this.pageIndex < maxPage) {
      this.pageIndex++;
      this.getAllPaginatedTasks();
    }
  }
}
