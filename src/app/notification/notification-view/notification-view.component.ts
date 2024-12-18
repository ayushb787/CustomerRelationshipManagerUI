import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertNotificationService } from '../../services/alert-notification.service';
@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NzSpinComponent, FormsModule, CommonModule],
  templateUrl: './notification-view.component.html',
  styleUrls: ['./notification-view.component.css'],
})
export class NotificationViewComponent implements OnInit {
  notifications: Notification[] = [];
  loading: boolean = false;
  showNotifications: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private alert: AlertNotificationService,
  ) {}

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) { 
      this.alert.alertNotification('User ID missing', 'error');
      return;
    }

    this.loading = true;
    this.notificationService.getNotifications(userId).subscribe(
      (data) => {
        this.notifications = data.data;
        this.loading = false;
      },
      (error) => { 
        this.loading = false;
      }
    );
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.readStatus).length;
  }

  markAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.notificationId === notificationId);
    if (notification && !notification.readStatus) {
      this.notificationService.markAsRead(notificationId).subscribe(
        (updatedNotification) => {
          this.notifications = this.notifications.map((notification) =>
            notification.notificationId === notificationId ? updatedNotification : notification
          );
          this.cdr.detectChanges();
        },
        (error) => { 
          this.alert.alertNotification(error, 'error'); 
        }
      );
    }
  }

  toggleNotifications(show: boolean): void {
    this.showNotifications = show;
  }
}
