import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { currentEnvironment } from '../../../../environment.config';
import { LogoDropmessageComponent } from '../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';
import { CreateUserCredentialsService } from '../../../shared/service/create-user-credentials/create-user-credentials.service';

const SharedComponents = [
  LogoDropmessageComponent,
  InputCustomDirective,
  ButtonStyleDirective,
];

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [...SharedComponents, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  private baseUrl: string = currentEnvironment.baseURL;
  buttonDisalbled: boolean = false;

  constructor(
    private router: Router,
    private createUserCredentialsService: CreateUserCredentialsService
  ) {}

  ngOnInit(): void {
    console.log(this.baseUrl);
  }

  navigateToSign() {}

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

  createAccount() {
    this.router.navigate(['home/post-messages']);
  }

  goToAuthSign() {
    this.router.navigate(['auth/sign']); // Redireciona para a rota signup
  }
}
