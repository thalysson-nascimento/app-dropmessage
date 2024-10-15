import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoDropmessageComponent } from '../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonStyleDirective } from '../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../shared/directives/input-custom/input-custom.directive';

const SharedComponents = [
  LogoDropmessageComponent,
  InputCustomDirective,
  ButtonStyleDirective,
];

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, ...SharedComponents],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {}
