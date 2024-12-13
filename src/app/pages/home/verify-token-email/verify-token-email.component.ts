import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../shared/component/loading/loading.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';

const SharedComponents = [ButtonStyleDirective, LoadingComponent];

const CoreModule = [CommonModule];

@Component({
  selector: 'app-verify-token-email',
  templateUrl: './verify-token-email.component.html',
  styleUrls: ['./verify-token-email.component.scss'],
  standalone: true,
  imports: [...SharedComponents, ...CoreModule],
})
export class VerifyTokenEmailComponent implements OnInit {
  buttonDisalbled: boolean = false;
  isLoadingButton: boolean = false;

  constructor() {}

  ngOnInit() {}

  sendEmailConfirmation() {}
}
