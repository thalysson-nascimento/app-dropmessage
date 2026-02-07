import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';

const SharedComponents = [ButtonStyleDirective];

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
  standalone: true,
  imports: [...SharedComponents],
})
export class PaymentSuccessComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  goToHome() {
    this.router.navigateByUrl('home/main/post-message');
  }
}
