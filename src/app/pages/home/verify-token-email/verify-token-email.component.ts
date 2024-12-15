import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);
  token!: string;

  constructor() {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.verifyEmail(token);
      }
    });
  }

  private verifyEmail(token: string) {
    console.log(token);
    this.token = token;
    // this.authService.verifyEmail(token).subscribe({
    //   next: (response) => {
    //     // Tratar sucesso
    //     console.log('Email verificado com sucesso');
    //   },
    //   error: (error) => {
    //     // Tratar erro
    //     console.error('Erro na verificação de email', error);
    //   }
    // });
  }

  sendEmailConfirmation() {}
}
