import { Component, OnInit } from '@angular/core';
import { AlertNotificationService } from '../../services/alert-notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alert-notification',
  templateUrl: './alert-notification.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./alert-notification.component.css'],
})
export class AlertNotificationComponent implements OnInit {
  message: string = '';
  messageType: 'success' | 'error' | null = null;

  constructor(private notificationService: AlertNotificationService) {}

  ngOnInit(): void {
    this.notificationService.currentNotification.subscribe((data: any) => {
      this.message = data.message;
      this.messageType = data.type;
    });
  }
}
