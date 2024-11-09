import { Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guard/auth/auth.guard';
import { AuthComponent } from './auth.component';
import { InformationUserRegistredComponent } from './information-user-registred/information-user-registred.component';
import { PrivacyPoliceComponent } from './privacy-police/privacy-police.component';
import { SignComponent } from './sign/sign.component';
import { SignupComponent } from './signup/signup.component';
import { TesteComponent } from './teste/teste.component';

export const authRouting: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'auth/sign', // Redireciona para sign ao acessar "auth/"
        pathMatch: 'full',
      },
      {
        path: 'auth/sign',
        component: SignComponent,
      },
      {
        path: 'auth/signup',
        component: SignupComponent,
      },
      {
        path: 'auth/information-user-registred',
        component: InformationUserRegistredComponent,
      },
      {
        path: 'auth/teste',
        component: TesteComponent,
      },
      {
        path: 'auth/privacy-police',
        component: PrivacyPoliceComponent,
      },
    ],
  },
];
