import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertNotificationService {
  private messageSource = new BehaviorSubject<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null,
  });
  currentNotification = this.messageSource.asObservable();

  constructor() {}

  alertNotification(message: string, type: 'success' | 'error') {
    this.messageSource.next({ message, type });

    // Auto-hide the notification after 3 seconds
    setTimeout(() => {
      this.messageSource.next({ message: '', type: null });
    }, 3000);
  }
}
