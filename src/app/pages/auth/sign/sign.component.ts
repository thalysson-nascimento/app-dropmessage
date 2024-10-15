import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogoDropmessageComponent } from '../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../shared/directives/input-custom/input-custom.directive';

const SharedComponents = [
  LogoDropmessageComponent,
  InputCustomDirective,
  ButtonStyleDirective,
];

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [...SharedComponents],
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.scss',
})
export class SignComponent {
  buttonDisalbled: boolean = true;

  constructor(private router: Router) {}

  navigateToSignup() {
    this.router.navigate(['auth/signup']); // Redireciona para a rota signup
  }

  userSign() {
    console.log('enviar credenciais');
  }
}
