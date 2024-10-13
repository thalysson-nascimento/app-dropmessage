import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { currentEnvironment } from '../../../../environment.config';
import { CreateUserCredentialsService } from '../../../shared/service/create-user-credentials/create-user-credentials.service';

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

  constructor(
    private router: Router,
    private createUserCredentialsService: CreateUserCredentialsService
  ) {}

  ngOnInit(): void {
    console.log(this.baseUrl);
  }

  navigateToSign() {
    this.router.navigate(['auth/sign']); // Redireciona para a rota signup
  }

  navigateToPosts() {
    this.router.navigate(['home/post-messages']); // Redireciona para a rota signup
  }

  createUser() {
    console.log('Criando usário...');
    this.createUserCredentialsService.userCredentials().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
