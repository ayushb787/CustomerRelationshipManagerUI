import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service'; 
import { LeadService } from '../../services/lead.service';
import { Task } from '../../models/task.model'; 
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AlertNotificationService } from '../../services/alert-notification.service';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [FormsModule, NzSpinModule, CommonModule],
  templateUrl: './create.component.html',
})
export class TaskCreateComponent implements OnInit {
  task: Task = {
    taskId: 0,
    assignedTo: 0,
    description: '',
    dueDate: '',
    status: '',
    priority: '',
  };

  users: any = []; 
  isLoading = false;

  constructor(
    private taskService: TaskService,
    private userService: LeadService,  
    private message: NzMessageService,
    private router: Router,
    private alert: AlertNotificationService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
 
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response.data; 
        this.isLoading = false;  
      },
      (error) => {
        this.isLoading = false; 
        this.alert.alertNotification('Error fetching users', 'error'); 
      }
    );
  }

  createTask(): void {
    this.isLoading = true;
    this.taskService.createTask(this.task).subscribe(
      () => {
      this.isLoading = false;
      this.router.navigate(['/dashboard/all-tasks'], { replaceUrl: true });
    },
    (error) => {
      this.isLoading = false; 
      this.alert.alertNotification('Failed to add task', 'error'); 
    }
  );
  }
}
