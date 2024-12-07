import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSpinModule],
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css']
})
export class CustomerCreateComponent implements OnInit {
  customer: any = {};
  isLoading = false;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createCustomer(): void {
    this.isLoading = true;
    this.customerService.createCustomer(this.customer).subscribe(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard/customers'], {replaceUrl: true});
    });
    this.isLoading = false;
  }
}
