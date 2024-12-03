import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css']
})
export class CustomerCreateComponent implements OnInit {
  customer: any = {};

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createCustomer(): void {
    this.customerService.createCustomer(this.customer).subscribe(() => {
      this.router.navigate(['/dashboard/customers']);
    });
  }
}