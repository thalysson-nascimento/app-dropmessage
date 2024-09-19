import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [],
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.scss'
})
export class SignComponent {
  constructor(private router: Router) {}

  navigateToSignup() {
    this.router.navigate(['auth/signup']);  // Redireciona para a rota signup
  }
}
