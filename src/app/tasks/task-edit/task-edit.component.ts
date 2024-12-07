import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [NzTableModule, FormsModule, NzSpinComponent],
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {
  task: Task = {
    assignedTo: 0,
    description: '',
    dueDate: '',
    priority: '',
    status: '',
    taskId: 0
  };
  isLoading: boolean = false;
  taskId: string | null = null;  

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.loadTask();
    } else {
      console.error('Task ID is missing');
    }
  }

  loadTask(): void {
    if (!this.taskId) return;

    this.isLoading = true;
    this.taskService.getTaskById(this.taskId).subscribe(
      (task: any) => {
        this.isLoading = false;
        this.task = task.data;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error loading task:', error);
      }
    );
  }

  updateTaskStatus(): void {
    if (!this.taskId) return;

    this.isLoading = true; 

    this.taskService.updateTask(this.taskId, this.task).subscribe(
      (response) => {
        this.isLoading = false;
        alert('Task updated successfully'); 
        if(this.taskService.getRole() == "Admin"){
          this.router.navigate(['/dashboard/all-tasks/'], { replaceUrl: true });
        }else{
          this.router.navigate(['/dashboard/tasks/'], { replaceUrl: true });
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error updating task status:', error);
      }
    );
  }

  

}
