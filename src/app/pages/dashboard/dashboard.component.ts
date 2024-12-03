import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NzCardComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
