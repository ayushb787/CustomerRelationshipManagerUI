import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Task } from '../../models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-all-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NzSpinModule, NzTableModule],
  templateUrl: './task-all-list.component.html',
  styleUrls: ['./task-all-list.component.css']
})
export class TaskAllListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAllTasks();
  }

  fetchAllTasks(): void {
    this.loading = true;
    this.taskService.getAllTasks().subscribe(
      (response: any) => {
        this.tasks = response.data;
        this.total = response.total;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching tasks:', error);
      }
    );
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.fetchAllTasks();
  }

  getAssignedUsername(userId: number): string {
    return `User ${userId}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  editTask(taskId: number): void {
    this.router.navigate([`dashboard/tasks/${taskId}`], { replaceUrl: true });
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe(
        () => {
          this.fetchAllTasks(); 
        },
        (error) => {
          console.error('Error deleting task:', error);
        }
      );
    }
  }
}
