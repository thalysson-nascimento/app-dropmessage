import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  constructor(private router: Router) {}

  navigateToSign() {
    this.router.navigate(['auth/sign']);  // Redireciona para a rota signup
  }
}
