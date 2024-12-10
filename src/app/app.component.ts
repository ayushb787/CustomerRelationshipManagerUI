import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertNotificationComponent } from './shared/alert-notification/alert-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertNotificationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
