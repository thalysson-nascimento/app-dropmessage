import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { currentEnvironment } from '../../../../environment.config';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  private baseUrl: string = currentEnvironment.baseURL;
  name = 'oii';

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log(this.baseUrl);
  }

  navigateToSign() {
    this.router.navigate(['auth/sign']); // Redireciona para a rota signup
  }
}
